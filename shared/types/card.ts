export type CardArtwork = {
  id: string;
  title: string;
  year: number | null;
  imageUrl: string;
  authors: string[];
  buildings: string[];
  copyright: string;
};

export type CardBook = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
};

export type CardRecipe = {
  id: number;
  title: string;
  sourceUrl: string;
};

export type PostcardMeta = {
  city: string | null;
  weatherMain: string | null;
  temperatureCelsius: number | null;
  createdAt: string;
};

export type PostCard = {
  id: number;
  userId: number;
  artwork: CardArtwork;
  book: CardBook;
  recipe: CardRecipe;
  postcardMeta: PostcardMeta;
};