import { describe, expect, it } from 'vitest';
import { rankSpotifyResults } from './spotifyRanker.js';

describe('rankSpotifyResults', () => {
  it('ranks tracks by the best matching top-item score and then search rank', () => {
    const result = rankSpotifyResults(
      [
        {
          id: 'track-2',
          name: 'Track 2',
          artists: ['Artist B'],
          album: 'Album',
          imageUrl: '',
          spotifyUrl: '',
          rank: 2,
        },
        {
          id: 'track-1',
          name: 'Track 1',
          artists: ['Artist A'],
          album: 'Album',
          imageUrl: '',
          spotifyUrl: '',
          rank: 1,
        },
        {
          id: 'track-3',
          name: 'Track 3',
          artists: ['Unknown Artist'],
          album: 'Album',
          imageUrl: '',
          spotifyUrl: '',
          rank: 3,
        },
      ],
      [],
      [],
      {
        tracks: [{
          id: 'track-1',
          name: 'Track 1',
          artists: ['Artist A'],
          album: 'Album',
          imageUrl: '',
          spotifyUrl: '',
          rank: 4 }],
        artists: [{ id: 'artist-a', name: 'Artist A', imageUrl: '', spotifyUrl: '', rank: 1 }],
      }
    );

    expect(result.tracks.map((track) => track.id)).toEqual(['track-1', 'track-2', 'track-3']);
  });

  it('ranks artists by top-item score and then search rank', () => {
    const result = rankSpotifyResults(
      [],
      [],
      [
        { id: 'artist-2', name: 'Artist 2', imageUrl: '', spotifyUrl: '', rank: 2 },
        { id: 'artist-1', name: 'Artist 1', imageUrl: '', spotifyUrl: '', rank: 1 },
        { id: 'artist-3', name: 'Artist 3', imageUrl: '', spotifyUrl: '', rank: 3 },
      ],
      {
        tracks: [],
        artists: [{ id: 'artist-1', name: 'Artist 1', imageUrl: '', spotifyUrl: '', rank: 2 }],
      }
    );

    expect(result.artists.map((artist) => artist.id)).toEqual(['artist-1', 'artist-2', 'artist-3']);
  });
});
