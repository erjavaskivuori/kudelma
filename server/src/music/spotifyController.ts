import type { Request, Response, NextFunction } from 'express';
import { generateSpotifyAuthUrl, exchangeSpotifyCodeForTokens } from './spotifyService.js';
import prisma from '../infra/prisma.js';

export const connectSpotify = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const authUrl = generateSpotifyAuthUrl();
    res.redirect(authUrl);
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

    const { accessToken, refreshToken, expiresIn } = await exchangeSpotifyCodeForTokens(code);

    // expires_in is usually 3600 seconds (1 hour)
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
        spotifyTokenExpiresAt: expiresAt,
      },
    });

    res.redirect(`/profile/${userId}?spotify_connected=true`);
  } catch (error) {
    next(error);
  }
};
