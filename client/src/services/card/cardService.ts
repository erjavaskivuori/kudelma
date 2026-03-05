import apiClient from "../../utils/apiClient";

export type bookForCard = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
};

export type artworkForCard = {
  id: string;
  title: string;
  year: number | null;
  imageUrl: string;
  authors: string[];
  buildings: string[] | null;
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
