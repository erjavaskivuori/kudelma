import prisma from '../infra/prisma.js';

export const saveRefreshToken = (
  userId: number,
  tokenHash: string,
  expiresAt: Date
) => {
  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
};

export const findRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
  });
};

export const revokeRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
};
