export interface PlaylistResult {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  spotifyUrl: string;
}

export interface TrackResult {
  id: string;
  name: string;
  artists: string[];
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

export interface ArtistResult {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
}

export interface RankedResults {
  tracks: TrackResult[];
  playlists: PlaylistResult[];
  artists: ArtistResult[];
}