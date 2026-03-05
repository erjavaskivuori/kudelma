import apiClient from "../../utils/apiClient";
import type { Book } from '../../../../shared/types/books';
import type { Artwork } from '../../../../shared/types/art';
import type { Recipe } from '../../../../shared/types/recipe';

export type FavoriteSelection = {
  book: Book;
  artwork: Artwork;
  recipe: Recipe;
};

export const createCard = async (selection: FavoriteSelection): Promise<void> => {
  const { book, artwork, recipe } = selection;
  const payload = {
    book: {
      id: book.id,
      title: book.title,
      year: book.year,
      authors: book.authors
    },
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
    recipe: {
      id: recipe.id,
      title: recipe.title,
      sourceUrl: recipe.sourceUrl,
    },
  };
  await apiClient.post('/cards', payload);
};
