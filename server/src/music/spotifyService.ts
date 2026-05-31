import axios from 'axios';
import querystring from 'querystring';
import { redis } from '../infra/redis.js';
import { HttpError } from '../utils/errors/index.js';
import type { SpotifySearchQueries } from '../genAI/genAITypes.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';
import type {
  ArtistResult,
  PlaylistResult,
  TrackResult,
  RankedResults
} from '../../../shared/types/music.js';
import type {
  SpotifyArtistSearchResponse,
  SpotifyPlaylistSearchResponse,
  SpotifyTrackSearchResponse
} from './spotifyTypes.js';

const EXPIRE_AT = getNextChangeTimestamp();

interface UserTopItems {
  tracks: TrackResult[];
  artists: ArtistResult[];
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

    console.warn(
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

  return allTracks.map((item) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((artist) => artist.name),
    album: item.album.name,
    imageUrl: item.album.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
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

  return allArtists.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
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

  return allPlaylists.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.images[0]?.url || '',
    spotifyUrl: item.external_urls.spotify,
  }));
};

const getUserTopItems = async (accessToken: string): Promise<UserTopItems> => {
  const queryparameters = querystring.stringify({
    time_range: 'long_term',
    limit: '50',
  });
  const [tracksResponse, artistsResponse] = await Promise.allSettled([
    axios.get<SpotifyTrackSearchResponse>(
      'https://api.spotify.com/v1/me/top/tracks?' + queryparameters, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
    axios.get<SpotifyArtistSearchResponse>(
      'https://api.spotify.com/v1/me/top/artists?' + queryparameters, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
  ]);

  const allTracks = tracksResponse.status === 'fulfilled'
    ? tracksResponse.value.data?.tracks.items ?? []
    : [];
  const allArtists = artistsResponse.status === 'fulfilled'
    ? artistsResponse.value.data?.artists.items ?? []
    : [];

  if (tracksResponse.status === 'rejected') {
    console.warn('Ignoring failed Spotify top tracks lookup', tracksResponse.reason);
  }

  if (artistsResponse.status === 'rejected') {
    console.warn('Ignoring failed Spotify top artists lookup', artistsResponse.reason);
  }

  return {
    tracks: allTracks.map((item, index) => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((artist) => artist.name),
      album: item.album.name,
      imageUrl: item.album.images[0]?.url || '',
      spotifyUrl: item.external_urls.spotify,
      rank: index + 1, // Add rank based on position in the list
    })),
    artists: allArtists.map((item, index) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.images[0]?.url || '',
      spotifyUrl: item.external_urls.spotify,
      rank: index + 1, // Add rank based on position in the list
    })),
  };
};

const rankResultsByRelevance = (
  queries: SpotifySearchQueries,
  tracks: TrackResult[],
  playlists: PlaylistResult[],
  artists: ArtistResult[],
  topItems: UserTopItems
) => {
  // Placeholder for a relevance ranking algorithm based on how well results match the queries
  // This could involve checking for exact matches, partial matches, and other heuristics
  // Could also utilise the gen AI service for natural language understanding of relevance
  console.log('Used queries:', queries);
  console.log('User\'s top tracks:', topItems.tracks.map(t => t.name));
  console.log('User\'s top artists:', topItems.artists.map(a => a.name));

  const results: RankedResults = {
    tracks: tracks, // Placeholder - should be sorted/filtered by relevance
    playlists: playlists, // Placeholder - should be sorted/filtered by relevance
    artists: artists, // Placeholder - should be sorted/filtered by relevance
  };

  return results; // Return ranked results
};

export const getSpotifyRecommendations = async (
  queries: SpotifySearchQueries, accessToken: string
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
  const trackQueries = normalizeQueries(queries.track);
  const playlistQueries = normalizeQueries(queries.playlist);

  const [trackResults, artistResults, playlistResults] = await Promise.all([
    collectSearchResults(trackQueries, (query) => searchSpotifyTracks(query, accessToken), 'track'),
    collectSearchResults(
      trackQueries, (query) => searchSpotifyArtists(query, accessToken), 'artist'
    ),
    collectSearchResults(
      playlistQueries, (query) => searchSpotifyPlaylists(query, accessToken), 'playlist'
    ),
  ]);

  const topItems = await getUserTopItems(accessToken);

  // Rank results based on relevance to the queries and user's listening history
  const rankedResults = rankResultsByRelevance(
    queries,
    trackResults,
    playlistResults,
    artistResults,
    topItems
  );

  await redis.set(cacheKey, JSON.stringify(rankedResults), {
    expiration: { type:'EXAT', value: EXPIRE_AT }
  });

  return rankedResults;
};
