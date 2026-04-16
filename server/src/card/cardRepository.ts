import prisma from '../infra/prisma.js';
import type { Card } from '../../generated/prisma/client.js';
import type { FavoriteSelection } from '../utils/schemas/favoriteSelectionSchema.js';

export type CardWithRelations = {
  id: number;
  userId: number;
  createdAt: Date;
  city: string | null;
  weatherMain: string | null;
  temperatureCelsius: number | null;
  art: {
    id: string;
    title: string;
    year: number | null;
    imageUrl: string;
    authors: string[];
    buildings: string[];
    copyright: string;
  };
  book: {
    id: string;
    title: string;
    authors: string[];
    year: number | null;
  };
  recipe: {
    id: number;
    title: string;
    sourceUrl: string;
  };
};

export const createCard = async (
  selection: FavoriteSelection,
  userId: number
): Promise<Card> => {
  const { book, artwork, recipe, postcardMeta } = selection;

  return prisma.card.create({
    data: {
      city: postcardMeta?.city ?? null,
      weatherMain: postcardMeta?.weatherMain ?? null,
      temperatureCelsius: postcardMeta?.temperatureCelsius ?? null,
      user: {
        connect: { id: userId },
      },
      art: {
        connectOrCreate: {
          where: { id: artwork.id },
          create: {
            ...artwork,
            buildings: artwork.buildings ?? [],
            year: artwork.year ?? null,
          },
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

export const getCardsByUserId = async (userId: number): Promise<CardWithRelations[]> => {
  const cards = await prisma.card.findMany({
    where: { userId },
    include: {
      art: true,
      book: true,
      recipe: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return cards as unknown as CardWithRelations[];
};
