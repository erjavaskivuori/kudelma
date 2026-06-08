import type { ArtistResult, PlaylistResult, TrackResult } from '../../../../shared/types/music';

export type SelectedMusic =
  | { kind: 'playlist'; playlist: PlaylistResult }
  | { kind: 'track'; track: TrackResult }
  | { kind: 'artist'; artist: ArtistResult };

export const serializeSelectedMusic = (selectedMusic: SelectedMusic) => {
  switch (selectedMusic.kind) {
    case 'playlist':
      return {
        playlist: {
          id: selectedMusic.playlist.id,
          title: selectedMusic.playlist.name,
          spotifyUrl: selectedMusic.playlist.spotifyUrl,
        },
      };
    case 'track':
      return {
        track: {
          id: selectedMusic.track.id,
          title: selectedMusic.track.name,
          artists: selectedMusic.track.artists,
          spotifyUrl: selectedMusic.track.spotifyUrl,
        },
      };
    case 'artist':
      return {
        artist: {
          id: selectedMusic.artist.id,
          name: selectedMusic.artist.name,
          spotifyUrl: selectedMusic.artist.spotifyUrl,
        },
      };
  }
};

export const getSelectedMusicImageUrl = (selectedMusic: SelectedMusic): string => {
  switch (selectedMusic.kind) {
    case 'playlist':
      return selectedMusic.playlist.imageUrl;
    case 'track':
      return selectedMusic.track.imageUrl;
    case 'artist':
      return selectedMusic.artist.imageUrl;
  }
};

export const getSelectedMusicLabel = (selectedMusic: SelectedMusic): string => {
  switch (selectedMusic.kind) {
    case 'playlist':
      return selectedMusic.playlist.name;
    case 'track':
      return selectedMusic.track.name;
    case 'artist':
      return selectedMusic.artist.name;
  }
};
