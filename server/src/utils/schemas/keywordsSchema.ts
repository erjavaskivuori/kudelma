import { z } from 'zod';

export const keywordsQuerySchema = z.object({
  keywords: z
    .string()
    .trim()
    .min(1, 'At least one keyword is required')
    .transform((value) =>
      value
        .split(',')
        .map((k) => k.trim().toLowerCase().replace(/ /g, '_'))
        .filter((k) => k.length > 0)
    )
    .refine((arr) => arr.length > 0, {
      message: 'At least one keyword is required',
    })
    .refine((arr) => arr.length <= 10, {
      message: 'Maximum 10 keywords allowed',
    }),
});

export type KeywordsQuery = z.infer<typeof keywordsQuerySchema>;
