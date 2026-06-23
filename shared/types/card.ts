type CardArtwork = {
  id: string;
  title: string;
  year: number | null;
  imageUrl: string;
  authors: string[];
  buildings: string[];
  copyright: string;
};

type CardBook = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
};

type CardRecipe = {
  id: number;
  title: string;
  sourceUrl: string;
};

type PostcardMeta = {
  city: string | null;
  weatherMain: string | null;
  temperatureCelsius: number | null;
  createdAt: string;
};

type Playlist = {
  id: string;
  title: string;
  spotifyUrl: string;
};

type Track = {
  id: string;
  title: string;
  artists: string[];
  spotifyUrl: string;
};

type Artist = {
  id: string;
  name: string;
  spotifyUrl: string;
};

export type PostCard = {
  id: number;
  user: {
    id: number;
    name: string;
  };
  artwork: CardArtwork;
  book: CardBook;
  recipe: CardRecipe;
  postcardMeta: PostcardMeta;
  playlist?: Playlist;
  track?: Track;
  artist?: Artist;
};