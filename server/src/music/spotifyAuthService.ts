import axios from 'axios';
import querystring from 'querystring';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../utils/errors/index.js';
import { syncSpotifyTokens, findUserById, updateSpotifyTokens } from '../user/userRepository.js';

const API_URL = process.env.API_URL || 'http://127.0.0.1:8080/api';
const REDIRECT_URI = `${API_URL}/music/spotify/callback`;
const SPOTIFY_STATE_EXPIRY = '10m';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface SpotifyStatePayload extends JwtPayload {
  userId: number;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError('JWT secret is not configured', 500);
  }
  return secret;
};

const createSpotifyState = (userId: number): string => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: SPOTIFY_STATE_EXPIRY });
};

export const verifySpotifyState = (state: string): number => {
  const decoded = jwt.verify(state, getJwtSecret());

  if (typeof decoded === 'string' || typeof (decoded as SpotifyStatePayload).userId !== 'number') {
    throw new HttpError('Invalid Spotify auth state', 400);
  }

  return (decoded as SpotifyStatePayload).userId;
};

export const generateSpotifyAuthUrl = (userId: number): string => {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new HttpError('Spotify Client ID is not configured', 500);
  }

  const scope = 'user-read-private';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state: createSpotifyState(userId),
  });

  return `https://accounts.spotify.com/authorize?${queryParams}`;
};

const getSpotifyErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown Spotify error';
};

export const exchangeSpotifyCodeForTokens = async (code: string, userId: number): Promise<void> => {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new HttpError('Spotify credentials are not configured', 500);
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post<SpotifyTokenResponse>(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
    });

    const expiresAt = new Date(Date.now() + response.data.expires_in * 1000);

    await syncSpotifyTokens(
      userId,
      response.data.access_token,
      response.data.refresh_token || '',
      expiresAt
    );
  } catch (error: unknown) {
    console.error('Error exchanging spotify code for tokens:', getSpotifyErrorMessage(error));
    throw new HttpError('Failed to authenticate with Spotify', 500);
  }
};

export const refreshSpotifyToken = async (refreshToken: string) => {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new HttpError('Spotify credentials are not configured', 500);
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post<SpotifyTokenResponse>(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
    });

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      // Spotify doesn't always return a new refresh token
      refreshToken: response.data.refresh_token || refreshToken,
    };
  } catch (error: unknown) {
    console.error('Error refreshing spotify token:', getSpotifyErrorMessage(error));
    throw new HttpError('Failed to refresh Spotify token', 500);
  }
};

export const getUserSpotifyAccessToken = async (userId: number): Promise<string> => {
  let user = await findUserById(userId);

  if (!user || !user.spotifyAccessToken) {
    throw new HttpError('Spotify not connected for user', 400);
  }

  let accessToken = user.spotifyAccessToken;

  if (user.spotifyTokenExpiresAt && new Date() > user.spotifyTokenExpiresAt) {
    if (!user.spotifyRefreshToken) {
      throw new HttpError('Spotify refresh token missing', 400);
    }

    const refreshed = await refreshSpotifyToken(user.spotifyRefreshToken);

    const newExpiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);
    user = await updateSpotifyTokens(
      userId,
      refreshed.accessToken,
      refreshed.refreshToken,
      newExpiresAt
    );
    if (!refreshed.accessToken) {
      throw new HttpError('Failed to refresh Spotify access token', 500);
    }
    accessToken = refreshed.accessToken;
  }

  return accessToken;
};
