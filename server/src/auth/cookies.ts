import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const sameSite: CookieOptions['sameSite'] = isProduction ? 'none' : 'lax';

export const accessTokenCookie: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure: isProduction,
  maxAge: 15 * 60 * 1000,  // 15 minutes
};

export const refreshTokenCookie: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure: isProduction,
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
};
