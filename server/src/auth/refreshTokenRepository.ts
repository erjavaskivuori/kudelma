import prisma from '../infra/prisma.js';

export const saveRefreshToken = (
  userId: string,
  tokenHash: string,
  expiresAt: Date
) => {
  return prisma.refreshToken.create({
    data: {
      userId: parseInt(userId, 10),
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
