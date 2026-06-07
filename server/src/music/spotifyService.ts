import axios from 'axios';
import querystring from 'querystring';
import logger from '../utils/logger.js';
import { redis } from '../infra/redis.js';
import { HttpError } from '../utils/errors/index.js';
import type { SpotifyQueries } from '../genAI/genAITypes.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';
import type {
  ArtistResult,
  PlaylistResult,
  TrackResult,
  RankedResults
} from '../../../shared/types/music.js';
import type {
  SpotifyArtistSearchResponse,
  SpotifyArtistSearchResult,
  SpotifyPlaylistSearchResponse,
  SpotifyTrackSearchResponse,
  SpotifyTrackSearchResult
} from './spotifyTypes.js';
import { rankSpotifyResults } from './spotifyRanker.js';

const EXPIRE_AT = getNextChangeTimestamp();

export interface UserTopItems {
  tracks: Array<TrackResult & { rank?: number }>;
  artists: Array<ArtistResult & { rank?: number }>;
}

const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
};

const normalizeQueries = (queries: string[]): string[] => {
  return [...new Set(queries.map((query) => query.trim()).filter(Boolean))];
};

const collectSearchResults = async <T extends { id: string }>(
  queries: string[],
  search: (query: string) => Promise<T[]>,
  label: string
): Promise<T[]> => {
  const settledResults = await Promise.allSettled(queries.map((query) => search(query)));

  const collectedResults = settledResults.flatMap((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    logger.warn(
      `Ignoring failed Spotify ${label} search for query: ${queries[index]}`, result.reason
    );
    return [];
  });

  return dedupeById(collectedResults);
};

const searchSpotifyTracks = async (query: string, accessToken: string): Promise<TrackResult[]> => {
  const queryparameters = querystring.stringify({
    q: query,
    type: 'track',
    limit: '10',
  });

  const response = await axios.get<SpotifyTrackSearchResponse>(
    'https://api.spotify.com/v1/search?' + queryparameters, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  if (!response.data) {
    throw new HttpError(`Spotify API error: ${response.statusText}`);
  }
  const allTracks = response.data.tracks.items;
  const nonNullTracks = allTracks.filter(item => item);

  return nonNullTracks.map((item, index) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((artist) => artist.name),
    album: item.album.name,
    imageUrl: item.album.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
    rank: index + 1, // Add rank based on position in the list
  }));
};

const searchSpotifyArtists = async (
  query: string,
  accessToken: string
): Promise<ArtistResult[]> => {
  const queryparameters = querystring.stringify({
    q: query,
    type: 'artist',
    limit: '10',
  });

  const response = await axios.get<SpotifyArtistSearchResponse>(
    'https://api.spotify.com/v1/search?' + queryparameters, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  if (!response.data) {
    throw new HttpError(`Spotify API error: ${response.statusText}`);
  }

  const allArtists = response.data.artists.items;
  const nonNullArtists = allArtists.filter(item => item);

  return nonNullArtists.map((item, index) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
    rank: index + 1, // Add rank based on position in the list
  }));
};

const searchSpotifyPlaylists = async (
  query: string, accessToken: string
): Promise<PlaylistResult[]> => {
  const queryparameters = querystring.stringify({
    q: query,
    type: 'playlist',
    limit: '10',
  });

  const response = await axios.get<SpotifyPlaylistSearchResponse>(
    'https://api.spotify.com/v1/search?' + queryparameters, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  if (!response.data) {
    throw new HttpError(`Spotify API error: ${response.statusText}`);
  }
  const allPlaylists = response.data.playlists.items;
  const nonNullPlaylists = allPlaylists.filter(item => item);

  return nonNullPlaylists.map((item, index) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
    rank: index + 1, // Add rank based on position in the list
  }));
};

const getUserTopItems = async (accessToken: string): Promise<UserTopItems> => {
  const queryparameters = querystring.stringify({
    time_range: 'long_term',
    limit: '50',
  });
  const [tracksResponse, artistsResponse] = await Promise.allSettled([
    axios.get<SpotifyTrackSearchResult>(
      'https://api.spotify.com/v1/me/top/tracks?' + queryparameters, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
    axios.get<SpotifyArtistSearchResult>(
      'https://api.spotify.com/v1/me/top/artists?' + queryparameters, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
  ]);

  const allTracks = tracksResponse.status === 'fulfilled'
    ? tracksResponse.value.data?.items ?? []
    : [];
  const allArtists = artistsResponse.status === 'fulfilled'
    ? artistsResponse.value.data?.items ?? []
    : [];

  if (tracksResponse.status === 'rejected') {
    logger.warn('Ignoring failed Spotify top tracks lookup', tracksResponse.reason);
  }

  if (artistsResponse.status === 'rejected') {
    logger.warn('Ignoring failed Spotify top artists lookup', artistsResponse.reason);
  }
  const nonNullTracks = allTracks.filter(item => item);
  const nonNullArtists = allArtists.filter(item => item);

  return {
    tracks: nonNullTracks.map((item, index) => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((artist) => artist.name),
      album: item.album.name,
      imageUrl: item.album.images[0]?.url || '',
      spotifyUrl: item.external_urls.spotify,
      rank: index + 1, // Add rank based on position in the list
    })),
    artists: nonNullArtists.map((item, index) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.images[0]?.url || '',
      spotifyUrl: item.external_urls.spotify,
      rank: index + 1, // Add rank based on position in the list
    })),
  };
};

export const getSpotifyRecommendations = async (
  queries: SpotifyQueries,
  accessToken: string,
) => {
  const cacheKey = `spotify-recommendations:${JSON.stringify(queries)}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData) as RankedResults;
      return parsed;
    } catch {
      // Fall through to regeneration.
    }
  }
  const genreQueries = normalizeQueries(queries.genres);
  const playlistQueries = normalizeQueries(queries.playlists);

  const [trackResults, artistResults, playlistResults] = await Promise.all([
    collectSearchResults(genreQueries, (query) => searchSpotifyTracks(query, accessToken), 'track'),
    collectSearchResults(
      genreQueries, (query) => searchSpotifyArtists(query, accessToken), 'artist'
    ),
    collectSearchResults(
      playlistQueries, (query) => searchSpotifyPlaylists(query, accessToken), 'playlist'
    ),
  ]);

  const topItems = await getUserTopItems(accessToken);

  const rankedResults = rankSpotifyResults(
    trackResults,
    playlistResults,
    artistResults,
    topItems
  );

  const limitedResults = {
    tracks: rankedResults.tracks.slice(0, 10),
    artists: rankedResults.artists.slice(0, 5),
    playlists: rankedResults.playlists.slice(0, 10),
  };

  await redis.set(cacheKey, JSON.stringify(limitedResults), {
    expiration: { type:'EXAT', value: EXPIRE_AT }
  });

  return limitedResults;
};
