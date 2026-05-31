import type { Request, Response } from 'express';
import {
  generateSpotifyAuthUrl,
  exchangeSpotifyCodeForTokens,
  verifySpotifyState,
} from './spotifyAuthService.js';

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

  if (errorParam) {
    return res.redirect(`/profile/${userId}?error=spotify_auth_failed`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing Spotify authorization code' });
  }

  await exchangeSpotifyCodeForTokens(code, userId);

  return res.redirect(`/profile/${userId}?spotify_connected=true`);
};
