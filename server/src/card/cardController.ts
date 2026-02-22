import type { Request, Response } from 'express';
import { createCard } from './cardService.js';
import {
  favoriteSelectionSchema,
  type FavoriteSelection
} from '../utils/schemas/favoriteSelectionSchema.js';
import { jwtPayloadSchema } from '../utils/schemas/jwtPayloadSchema.js';
import { validate } from '../utils/validate.js';
import type { JwtPayload } from '../utils/token.js';

export const createCardController = async (req: Request, res: Response) => {
  const { book, artwork, recipe } = validate<FavoriteSelection>(favoriteSelectionSchema, req.body);

  const user = validate<JwtPayload>(jwtPayloadSchema, req.user);
  const userId = user.id;

  const card = await createCard({ book, artwork, recipe }, userId);

  res.status(201).json(card);
};
