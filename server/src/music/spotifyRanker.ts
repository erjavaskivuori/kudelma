import type {
  ArtistResult,
  PlaylistResult,
  TrackResult,
  RankedResults
} from '../../../shared/types/music.js';
import type { UserTopItems } from './spotifyService.js';

const getLowestRank = (ranks: Array<number | undefined>): number | undefined => {
  const validRanks = ranks.filter((rank): rank is number => typeof rank === 'number');

  if (validRanks.length === 0) {
    return undefined;
  }

  return Math.min(...validRanks);
};

const compareByScoreThenRank = (
  left: { score: number; rank: number },
  right: { score: number; rank: number }
): number => {
  if (left.score !== right.score) {
    return left.score - right.score;
  }

  return left.rank - right.rank;
};

export const rankSpotifyResults = (
  tracks: TrackResult[],
  playlists: PlaylistResult[],
  artists: ArtistResult[],
  topItems: UserTopItems): RankedResults =>
{
  const topTrackRanks = new Map(topItems.tracks.map((item) => [item.id, item.rank]));
  const topArtistRanksById = new Map(topItems.artists.map((item) => [item.id, item.rank]));
  const topArtistRanksByName = new Map(
    topItems.artists.map((item) => [item.name.trim().toLowerCase(), item.rank])
  );

  const rankedTracks = tracks
    .map((track) => {
      const trackRank = topTrackRanks.get(track.id);
      const artistRanks = track.artists.map(
        (artist) => topArtistRanksByName.get(artist.trim().toLowerCase())
      );
      const score = getLowestRank(
        [trackRank, getLowestRank(artistRanks)]
      ) ?? Number.POSITIVE_INFINITY;

      return { ...track, score };
    })
    .sort(compareByScoreThenRank)
    .map(({ score: _score, ...track }) => track);

  const rankedArtists = artists
    .map((artist) => {
      const score = topArtistRanksById.get(artist.id) ?? Number.POSITIVE_INFINITY;

      return { ...artist, score };
    })
    .sort(compareByScoreThenRank)
    .map(({ score: _score, ...artist }) => artist);

  const rankedPlaylists = [...playlists].sort((left, right) => left.rank - right.rank);

  return {
    tracks: rankedTracks,
    playlists: rankedPlaylists,
    artists: rankedArtists,
  };
};
