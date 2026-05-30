import prisma from '../infra/prisma.js';
import type { Prisma, User } from '../../generated/prisma/client.js';

export type UserProfileRecord = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    cardsVisibility: true;
  };
}>;

export const findByName = async (name: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { name },
  });
};

export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findProfileById = async (id: number): Promise<UserProfileRecord | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      cardsVisibility: true,
    },
  });
};

export const createUser = async (
  name: string,
  email: string | null,
  password: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const syncSpotifyTokens = async (
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      spotifyAccessToken: accessToken,
      spotifyRefreshToken: refreshToken,
      spotifyTokenExpiresAt: expiresAt,
    },
  });
};
