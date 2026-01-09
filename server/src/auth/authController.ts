import type { Response } from 'express';
import { validate } from '../utils/validate.js';
import { userSchema } from '../utils/schemas/userSchema.js';
import type { UserInput } from '../utils/schemas/userSchema.js';
import { registerUser } from '../auth/authService.js';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = validate<UserInput>(userSchema, req.body);

  const newUser = await registerUser(name, email || null, password);

  return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
};
