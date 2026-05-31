import { z } from 'zod';

export const musicCueSchema = z.object({
  weatherData: z.object({
    id: z.number(),
    main: z.string(),
    city: z.string(),
    temperature: z.number(),
    cloudiness: z.number(),
    sunrise: z.string(),
    sunset: z.string(),
  }),
  activity: z.string().optional(),
  moods: z.array(z.string()).optional(),
});

export type MusicCueBody = z.infer<typeof musicCueSchema>;
