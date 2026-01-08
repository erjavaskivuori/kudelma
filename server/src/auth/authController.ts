import type { Response } from 'express';
import { HttpError } from '../utils/errors/HttpError.js';
import { registerUser } from '../auth/authService.js';
import type { TypedRequestBody } from '../types/express.js';

type RegisterRequestBody = {
  name: string;
  email: string | null;
  password: string;
};

export const register = async (req: TypedRequestBody<RegisterRequestBody>, res: Response) => {
  const { name, email, password }= req.body;

  if (!name || typeof name !== 'string') {
    throw new HttpError('Name is required and must be a string', 400);
  }

  if (email !== null && email !== undefined && typeof email !== 'string') {
    throw new HttpError('Email must be a string or null', 400);
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new HttpError('Password is required and must be at least 6 characters long', 400);
  }

  const newUser = await registerUser(name, email || null, password);

  return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
};
