import apiClient from "../../utils/apiClient";
import type { Book } from '../../../../shared/types/books';
import type { Artwork } from '../../../../shared/types/art';
import type { Recipe } from '../../../../shared/types/recipe';
import type { SelectedMusic } from './musicSelection';
import { serializeSelectedMusic } from './musicSelection';

export type FavoriteSelection = {
  book?: Book;
  artwork: Artwork;
  recipe?: Recipe;
  selectedMusic?: SelectedMusic | null;
  postcardMeta?: {
    city?: string;
    weatherMain?: string;
    temperatureCelsius?: number;
  };
};

export const createCard = async (selection: FavoriteSelection): Promise<void> => {
  const { book, artwork, recipe, postcardMeta, selectedMusic } = selection;
  const payload = {
    book: book ? {
      id: book.id,
      title: book.title,
      year: book.year,
      authors: book.authors
    } : undefined,
    artwork: {
      id: artwork.id,
      title: artwork.title,
      year: artwork.year,
      imageUrl: artwork.imageUrl,
      authors: artwork.authors.map(author => author.name),
      buildings: artwork.buildings
        ? artwork.buildings.map(building => building.translated)
        : null,
      copyright: artwork.imageRights.copyright
    },
    recipe: recipe ? {
      id: recipe.id,
      title: recipe.title,
      sourceUrl: recipe.sourceUrl,
    } : undefined,
    postcardMeta,
    ...(selectedMusic ? serializeSelectedMusic(selectedMusic) : {}),
  };
  await apiClient.post('/cards/create', payload);
};

export const changeCardVisibility = async (visibility: 'PRIVATE' | 'PUBLIC'): Promise<void> => {
  await apiClient.patch('/cards/visibility', { visibility });
};

export const removeCard = async (cardId: number): Promise<void> => {
  await apiClient.delete(`/cards/remove/${cardId}`);
};
