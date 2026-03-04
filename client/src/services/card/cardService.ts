import apiClient from "../../utils/apiClient";

export type bookForCard = {
  id: string;
  title: string;
  authors: string[];
  year?: number;
};

export type artworkForCard = {
  id: string;
  title: string;
  artist: string;
  year?: number;
  imageUrl: string;
  authors: string[];
  buildings: string[];
  copyright: string;
};

export type recipeForCard = {
  id: number;
  title: string;
  sourceUrl: string;
};

export type FavoriteSelection = {
  book: bookForCard;
  artwork: artworkForCard;
  recipe: recipeForCard;
};

export const createCard = async (selection: FavoriteSelection): Promise<void> => {
  await apiClient.post('/cards', selection);
};
