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
  playlist?: {
    id: string;
    title: string;
    spotifyUrl: string;
  };
  track?: {
    id: string;
    title: string;
    artists: string[];
    spotifyUrl: string;
  };
  artist?: {
    id: string;
    name: string;
    spotifyUrl: string;
  };
};

export const createCard = async (
  selection: FavoriteSelection,
  userId: number
): Promise<Card> => {
  const { book, artwork, recipe, postcardMeta, playlist, track, artist } = selection;

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
      ...(playlist && {
        playlist: {
          connectOrCreate: {
            where: { id: playlist.id },
            create: playlist,
          },
        },
      }),
      ...(track && {
        track: {
          connectOrCreate: {
            where: { id: track.id },
            create: track,
          },
        },
      }),
      ...(artist && {
        artist: {
          connectOrCreate: {
            where: { id: artist.id },
            create: artist,
          },
        },
      }),
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
      playlist: true,
      track: true,
      artist: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return cards as unknown as CardWithRelations[];
};

export const getCardById = async (
  cardId: number, userId: number
): Promise<CardWithRelations | null> => {
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId },
    include: {
      art: true,
      book: true,
      recipe: true,
      playlist: true,
      track: true,
      artist: true,
    },
  });

  return card as unknown as CardWithRelations | null;
};

export const removeCardById = async (cardId: number, userId: number): Promise<boolean> => {
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.card.deleteMany({
      where: { id: cardId, userId },
    });

    if (deleted.count === 0) {
      return false;
    }

    await Promise.all([
      tx.artwork.deleteMany({ where: { cards: { none: {} } } }),
      tx.book.deleteMany({ where: { cards: { none: {} } } }),
      tx.recipe.deleteMany({ where: { cards: { none: {} } } }),
      tx.playlist.deleteMany({ where: { cards: { none: {} } } }),
      tx.track.deleteMany({ where: { cards: { none: {} } } }),
      tx.artist.deleteMany({ where: { cards: { none: {} } } }),
    ]);

    return true;
  });
};
