import prisma from '../infra/prisma.js';
import type { User } from '../../generated/prisma/client.js';

export const findByName = async (name: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { name },
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
