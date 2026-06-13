import type { Request, Response } from 'express';
import { z } from 'zod';
import { createCard, getCardsForProfile, removeCard } from './cardService.js';
import {
  favoriteSelectionSchema,
  type FavoriteSelection
} from '../utils/schemas/favoriteSelectionSchema.js';
import { jwtPayloadSchema } from '../utils/schemas/jwtPayloadSchema.js';
import { validate } from '../utils/validate.js';
import type { JwtPayload } from '../utils/token.js';
import { updateCardsVisibility } from '../user/userRepository.js';

export const createCardController = async (req: Request, res: Response) => {
  const {
    book,
    artwork,
    recipe,
    postcardMeta,
    playlist,
    track,
    artist
  } = validate<FavoriteSelection>(
    favoriteSelectionSchema,
    req.body
  );

  const user = validate<JwtPayload>(jwtPayloadSchema, req.user);
  const userId = user.id;

  const card = await createCard({
    book, artwork, recipe, postcardMeta, playlist, track, artist
  }, userId);

  res.status(201).json(card);
};

export const getProfileCardsController = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  const parsedViewer = jwtPayloadSchema.safeParse(req.user);
  const viewerId = parsedViewer.success ? parsedViewer.data.id : undefined;

  const profileCards = await getCardsForProfile(userId, viewerId);

  res.status(200).json(profileCards);
};

export const updateCardsVisibilityController = async (req: Request, res: Response) => {
  const user = validate<JwtPayload>(jwtPayloadSchema, req.user);
  const userId = user.id;

  const { visibility } = validate<{ visibility: 'PRIVATE' | 'PUBLIC' }>(
    z.object({ visibility: z.enum(['PRIVATE', 'PUBLIC']) }),
    req.body
  );

  const updatedProfile = await updateCardsVisibility(userId, visibility);

  res.status(200).json({
    id: updatedProfile.id,
    name: updatedProfile.name,
    cardsVisibility: updatedProfile.cardsVisibility,
  });
};

export const removeCardController = async (req: Request, res: Response) => {
  const user = validate<JwtPayload>(jwtPayloadSchema, req.user);
  const userId = user.id;

  const cardId = Number(req.params.cardId);

  if (Number.isNaN(cardId)) {
    res.status(400).json({ error: 'Invalid card id' });
    return;
  }

  await removeCard(cardId, userId);

  res.status(204).send();
};
