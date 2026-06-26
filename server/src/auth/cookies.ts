const isProduction = process.env.NODE_ENV === 'production';

export const accessTokenCookie = {
  httpOnly: true,
  sameSite: (isProduction ? 'none' : 'lax'),
  secure: isProduction,
  maxAge: 15 * 60 * 1000,  // 15 minutes
};

export const refreshTokenCookie = {
  httpOnly: true,
  sameSite: (isProduction ? 'none' : 'lax'),
  secure: isProduction,
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
};
