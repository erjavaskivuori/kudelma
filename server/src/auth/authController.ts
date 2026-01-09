import type { Request, Response } from 'express';
import { validate } from '../utils/validate.js';
import { userSchema } from '../utils/schemas/userSchema.js';
import type { UserInput } from '../utils/schemas/userSchema.js';
import { loginUser, registerUser } from '../auth/authService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = validate<UserInput>(userSchema, req.body);

  await registerUser(name, email || null, password);

  const { token, user } = await loginUser(name, password);

  res.cookie('token', token, COOKIE_OPTIONS);

  return res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = validate<UserInput>(userSchema, req.body);

  const { token, user } = await loginUser(name, password);

  res.cookie('token', token, COOKIE_OPTIONS);

  return res.status(200).json(user);
};
