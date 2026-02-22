import prisma from '../infra/prisma.js';
import type { Card } from '../../generated/prisma/client.js';
import type { FavoriteSelection } from '../utils/schemas/favoriteSelectionSchema.js';

export const createCard = async (
  selection: FavoriteSelection,
  userId: number
): Promise<Card> => {
  const { book, artwork, recipe } = selection;

  return prisma.card.create({
    data: {
      user: {
        connect: { id: userId },
      },
      art: {
        connectOrCreate: {
          where: { id: artwork.id },
          create: { ...artwork, year: artwork.year ?? null },
        },
      },
      recipe: {
        connectOrCreate: {
          where: { id: recipe.id },
          create: recipe,
        },
      },
      book: {
        connectOrCreate: {
          where: { id: book.id },
          create: { ...book, year: book.year ?? null },
        },
      },
    },
  });
};
