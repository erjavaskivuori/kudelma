import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  id: z.number(),
  name: z.string(),
});
