import bcrypt from 'bcrypt';
import { createUser, findByName, findUserById } from '../user/userRepository.js';
import { createAccessToken, createRefreshToken, hashToken } from '../utils/token.js';
import {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken
} from './refreshTokenRepository.js';
import { HttpError } from '../utils/errors/HttpError.js';

const REFRESH_TOKEN_TTL_DAYS = 30;

type PrismaError = {
  code?: string;
  meta?: { target?: string[] };
};

export const registerUser = async (
  name: string,
  email: string | null,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    return await createUser(name, email, passwordHash);
  } catch (error) {
    const prismaError = error as PrismaError;

    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target;

      if (Array.isArray(target)) {
        if (target.includes('name')) {
          throw new HttpError('Username already taken', 409);
        }

        if (target.includes('email')) {
          throw new HttpError('Email already registered', 409);
        }
      }

      throw new HttpError('User already exists', 409);
    }

    throw error;
  }
};

export const loginUser = async (name: string, password: string) => {
  const user = await findByName(name);
  const passwordCorrect = user && (await bcrypt.compare(password, user.password));

  if (!passwordCorrect) {
    throw new HttpError('Invalid username or password', 401);
  }

  return { id: user.id, name: user.name, email: user.email };
};

export const issueTokens = async (user: { id: string; name: string }) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  await saveRefreshToken(
    user.id,
    hashToken(refreshToken),
    expiresAt
  );

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const stored = await findRefreshToken(hashToken(refreshToken));

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new HttpError('Invalid refresh token', 401);
  }

  const user = await findUserById(stored.userId);

  if (!user) {
    throw new HttpError('User not found', 401);
  }

  return createAccessToken({
    id: user.id.toString(),
    name: user.name,
  });
};

export const revokeToken = async (tokenHash: string) => {
  await revokeRefreshToken(hashToken(tokenHash));
};
