import axios from 'axios';
import querystring from 'querystring';
import { HttpError } from '../utils/errors/index.js';

const API_URL = process.env.API_URL || 'http://127.0.0.1:8080/api';
const REDIRECT_URI = `${API_URL}/music/spotify/callback`;

export const generateSpotifyAuthUrl = (): string => {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new HttpError('Spotify Client ID is not configured', 500);
  }

  const scope = 'user-read-private user-read-email user-top-read';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  });

  return `https://accounts.spotify.com/authorize?${queryParams}`;
};

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const getSpotifyErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown Spotify error';
};

export const exchangeSpotifyCodeForTokens = async (code: string) => {
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
        'Authorization': `Basic ${authHeader}`,
      },
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };
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
        'Authorization': `Basic ${authHeader}`,
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
