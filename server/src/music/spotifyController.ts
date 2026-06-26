import type { Request, Response } from 'express';
import { validate } from '../utils/validate.js';
import { musicCueSchema } from '../utils/schemas/musicCueSchema.js';
import type { MusicCueBody } from '../utils/schemas/musicCueSchema.js';
import {
  generateSpotifyAuthUrl,
  exchangeSpotifyCodeForTokens,
  getUserSpotifyAccessToken,
  verifySpotifyState,
} from './spotifyAuthService.js';
import { generateSpotifyQueries } from '../genAI/genAIService.js';
import { getSpotifyRecommendations } from './spotifyService.js';
import logger from '../utils/logger.js';

export const connectSpotify = (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const authUrl = generateSpotifyAuthUrl(userId);
  return res.json({ url: authUrl });
};

export const spotifyCallback = async (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : undefined;
  const errorParam = typeof req.query.error === 'string' ? req.query.error : undefined;

  if (!state) {
    return res.status(400).json({ error: 'Missing Spotify state' });
  }

  const userId = verifySpotifyState(state);

  const FRONTEND_URL = process.env.FRONTEND_URL || '';

  if (errorParam) {
    logger.error('Spotify authorization error', { userId, error: errorParam });
    return res.redirect(`${FRONTEND_URL}/profile/${userId}?error=spotify_auth_failed`);
  }

  if (!code) {
    logger.error('Missing Spotify authorization code', { userId });
    return res.status(400).json({ error: 'Missing Spotify authorization code' });
  }

  await exchangeSpotifyCodeForTokens(code, userId);

  return res.redirect(`${FRONTEND_URL}/profile/${userId}?spotify_connected=true`);
};

export const getRecommendations = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const accessToken = await getUserSpotifyAccessToken(userId);

  const validatedBody = validate<MusicCueBody>(musicCueSchema, req.body);
  const { weatherData, activity, moods } = validatedBody;

  if (!weatherData) {
    return res.status(400).json({ error: 'Missing weatherData in request body' });
  }

  const spotifyQueries = await generateSpotifyQueries(weatherData, activity, moods);

  const recommendations = await getSpotifyRecommendations(spotifyQueries, accessToken);

  return res.json({ recommendations });
};
