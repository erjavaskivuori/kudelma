import { HttpError } from '../utils/errors/HttpError.js';
import type { FavoriteSelection } from '../utils/schemas/favoriteSelectionSchema.js';
import { createCard as createCardInDb } from './cardRepository.js';

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
