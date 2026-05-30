import type { Request, Response, NextFunction } from 'express';
import { generateSpotifyAuthUrl, exchangeSpotifyCodeForTokens } from './spotifyAuthService.js';

export const connectSpotify = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const authUrl = generateSpotifyAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    next(error);
  }
};

export const spotifyCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;
    const errorParam = req.query.error as string;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (errorParam) {
      return res.redirect(`/profile/${userId}?error=spotify_auth_failed`);
    }

    await exchangeSpotifyCodeForTokens(code, userId);

    res.redirect(`/profile/${userId}?spotify_connected=true`);
  } catch (error) {
    next(error);
  }
};
