import { z } from 'zod';

export const userSchema = z.object({
  email: z
    .email('Invalid email address')
    .trim()
    .toLowerCase()
    .optional(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'Name can only contain letters, numbers, hyphens and underscores'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

export type UserInput = z.infer<typeof userSchema>;
