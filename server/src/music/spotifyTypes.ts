export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtistRef {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: 'album' | 'single' | 'compilation';
  uri: string;
  artists: SpotifyArtistRef[];
}

export interface SpotifyTrackItem {
  album: SpotifyAlbum;
  artists: SpotifyArtistRef[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  restrictions?: {
    reason: string;
  };
  name: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

export interface SpotifyTrackSearchResult {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrackItem[];
}

export interface SpotifyArtistItem {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyArtistSearchResult {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyArtistItem[];
}

export interface SpotifyTrackSearchResponse {
  tracks: SpotifyTrackSearchResult;
}

export interface SpotifyArtistSearchResponse {
  artists: SpotifyArtistSearchResult;
}

export interface SpotifyPlaylistOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: 'user';
  uri: string;
  display_name: string | null;
}

export interface SpotifyPlaylistItem {
  collaborative: boolean;
  description: string;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyPlaylistOwner;
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistSearchResult {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyPlaylistItem[];
}

export interface SpotifyPlaylistSearchResponse {
  playlists: SpotifyPlaylistSearchResult;
}

