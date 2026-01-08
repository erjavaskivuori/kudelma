import bcrypt from 'bcrypt';
import { createUser } from '../user/userRepository.js';
import { HttpError } from '../utils/errors/HttpError.js';

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
