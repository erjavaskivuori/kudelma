import type { Request, Response } from 'express';
import { validate } from '../utils/validate.js';
import { userSchema } from '../utils/schemas/userSchema.js';
import type { UserInput } from '../utils/schemas/userSchema.js';
import {
  loginUser,
  registerUser,
  issueTokens,
  refreshAccessToken,
  revokeToken,
  deleteUser
} from '../auth/authService.js';
import { accessTokenCookie, refreshTokenCookie } from '../auth/cookies.js';
import { jwtPayloadSchema } from '../utils/schemas/jwtPayloadSchema.js';
import type { JwtPayload } from '../utils/token.js';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = validate<UserInput>(userSchema, req.body);

  const user = await registerUser(name, email || null, password);

  const { accessToken, refreshToken } = await issueTokens({
    id: user.id,
    name: user.name
  });

  res.cookie('accessToken', accessToken, accessTokenCookie);
  res.cookie('refreshToken', refreshToken, refreshTokenCookie);

  return res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = validate<UserInput>(userSchema, req.body);

  const user = await loginUser(name, password);

  const { accessToken, refreshToken } = await issueTokens({
    id: user.id,
    name: user.name
  });

  res.cookie('accessToken', accessToken, accessTokenCookie);
  res.cookie('refreshToken', refreshToken, refreshTokenCookie);

  return res.status(200).json(user);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  const { accessToken: newAccessToken, user } = await refreshAccessToken(refreshToken);

  res.cookie('accessToken', newAccessToken, accessTokenCookie);
  return res.status(200).json(user);
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (refreshToken) {
    await revokeToken(refreshToken);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = validate<JwtPayload>(jwtPayloadSchema, req.user);

  if (user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  await deleteUser(userId);

  // Clear cookies after user deletion
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.sendStatus(204);
};
