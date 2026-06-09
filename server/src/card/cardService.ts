import { HttpError } from '../utils/errors/HttpError.js';
import type { FavoriteSelection } from '../utils/schemas/favoriteSelectionSchema.js';
import {
  createCard as createCardInDb,
  getCardsByUserId
} from './cardRepository.js';
import { findProfileById, updateCardsVisibility } from '../user/userRepository.js';
import type { ProfileCardsResponse } from '../../../shared/types/profile.js';

type PrismaError = {
  code?: string;
  meta?: { target?: string[] };
};

export const createCard = async (selection: FavoriteSelection, userId: number) => {
  try {
    const card = await createCardInDb(selection, userId);
    return card.id;
  } catch (error) {
    const prismaError = error as PrismaError;

    if (prismaError.code === 'P2002') {
      throw new HttpError('Card with the same selection already exists for this user');
    }

    throw error;
  }
};

export const getCardsForProfile = async (
  profileUserId: number,
  viewerUserId?: number
): Promise<ProfileCardsResponse> => {
  const profile = await findProfileById(profileUserId);

  if (!profile) {
    throw new HttpError('Profile not found', 404);
  }

  const cardsVisible = profile.cardsVisibility === 'PUBLIC' || viewerUserId === profile.id;

  if (!cardsVisible) {
    return {
      profile: {
        id: profile.id,
        name: profile.name,
        cardsVisibility: profile.cardsVisibility,
      },
      cardsVisible,
      cards: [],
    };
  }

  const cards = await getCardsByUserId(profileUserId);

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      cardsVisibility: profile.cardsVisibility,
    },
    cardsVisible,
    cards: cards.map((card) => ({
      id: card.id,
      userId: card.userId,
      artwork: {...card.art},
      book: {...card.book},
      recipe: {...card.recipe},
      postcardMeta: {
        city: card.city,
        weatherMain: card.weatherMain,
        temperatureCelsius: card.temperatureCelsius,
        createdAt: card.createdAt.toISOString(),
      },
      ...(card.playlist && { playlist: { ...card.playlist } }),
      ...(card.track && { track: { ...card.track } }),
      ...(card.artist && { artist: { ...card.artist } }),
    })),
  };
};

export const toggleCardsVisibility = async (userId: number, visibility: 'PRIVATE' | 'PUBLIC') => {
  const profile = await findProfileById(userId);

  if (!profile) {
    throw new HttpError('Profile not found', 404);
  }

  const updatedProfile = await updateCardsVisibility(userId, visibility);
  return {
    cardsVisibility: updatedProfile.cardsVisibility,
  };
};
