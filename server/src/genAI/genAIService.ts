import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { Keywords, SpotifyQueries } from './genAITypes.js';
import type { WeatherData } from '../../../shared/types/weather.js';
import { redis } from '../infra/redis.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';

const EXPIRE_AT = getNextChangeTimestamp();

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GENAI_PROMPT = process.env.GENAI_PROMPT;
const GENAI_MUSIC_PROMPT = process.env.GENAI_MUSIC_PROMPT;
const GENAI_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
];

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

if (!GENAI_PROMPT) {
  throw new Error('GENAI_PROMPT is not defined in environment variables');
}

if (!GENAI_MUSIC_PROMPT) {
  throw new Error('GENAI_MUSIC_PROMPT is not defined in environment variables');
}

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const getFallbackKeywords = (): Keywords => {
  const season = getSeason().toUpperCase();
  const raw = process.env[`FALLBACK_KEYWORDS_${season}`];

  if (!raw) {
    throw new Error(`FALLBACK_KEYWORDS_${season} is not defined in environment variables`);
  }

  return JSON.parse(raw) as Keywords;
};

const getSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const createContextualPrompt = (weather: WeatherData): string => {
  const context = JSON.stringify({
    date: new Date().toISOString(),
    season: getSeason(),
    time_of_day: getTimeOfDay(),
    weather,
    flag_day: false,
  });

  return `${GENAI_PROMPT}\nContext: ${context}`;
};

const createSpotifyContextPrompt = (
  weather: WeatherData,
  activity?: string,
  moods?: string[]
): string => {
  const context = JSON.stringify({
    date: new Date().toISOString(),
    season: getSeason(),
    time_of_day: getTimeOfDay(),
    weather,
    activity: activity || null,
    moods: moods || [],
    flag_day: false,
  });

  return [
    GENAI_MUSIC_PROMPT,
    `Context: ${context}`,
  ].join('\n');
};

const normalizeQuery = (query: string): string => {
  return query
    .replace(/^q\s*=\s*/i, '')
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const dedupeQueries = (queries: string[]): string[] => {
  return [...new Set(queries.map(normalizeQuery).filter(Boolean))];
};

const sanitizeQueryList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return dedupeQueries(
    value.filter((query): query is string => typeof query === 'string')
  );
};

const getFallbackQueries = (
  weather?: string,
  moods?: string[],
  activity?: string,
): SpotifyQueries => {
  const timeOfDay = getTimeOfDay();
  const season = getSeason();

  return {
    playlists: [
      `${moods ? moods[0] : ''} ${activity || ''} ${season}`.trim(),
      `${weather || ''} ${activity || ''}`.trim(),
      `${moods ? moods[0] : ''} ${season}`.trim(),
      `${moods ? moods[0] : ''} ${activity || ''}`.trim(),
      `${timeOfDay} ${activity || ''}`.trim(),
      `${moods ? moods[0] : ''} ${timeOfDay}`.trim(),
      `${weather || ''} ${season}`.trim(),
    ],
    genres: dedupeQueries([
      'pop',
      'indie',
      'jazz',
      `${moods ? moods[0] : ''}`,
      `${season}`,
    ]),
  };
};

const generateContentWithFallback = async (prompt: string): Promise<string> => {
  for (const model of GENAI_MODELS) {
    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      if (response?.text) {
        return response.text;
      }
      console.warn(`Model ${model} returned empty response, trying next`);
    } catch (error) {
      console.error(`Model ${model} failed:`, error, '— trying next model');
    }
  }
  throw new Error('All Gemini models failed');
};

const extractQueriesFromText = (text: string): SpotifyQueries => {
  const jsonStr = extractJsonFromText(text);
  const parsed = JSON.parse(jsonStr) as Partial<SpotifyQueries>;

  return {
    playlists: sanitizeQueryList(parsed.playlists),
    genres: sanitizeQueryList(parsed.genres)
  };
};

// Function to extract JSON from any text, regardless of formatting
const extractJsonFromText = (text: string): string => {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error('No valid JSON object found in response');
  }

  const jsonStr = text.substring(firstBrace, lastBrace + 1);
  return jsonStr;
};

export const generateKeywords = async (weather: WeatherData): Promise<Keywords> => {
  const cacheKey = `keywords:${JSON.stringify(weather)}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData) as Keywords;
  };

  const promptWithContext = createContextualPrompt(weather);
  let responseText: string;
  try {
    responseText = await generateContentWithFallback(promptWithContext);
  } catch (error) {
    console.error('All models failed for keywords, using fallback:', error);
    return getFallbackKeywords();
  }
  const jsonStr = extractJsonFromText(responseText);

  try {
    const keywords = JSON.parse(jsonStr) as Keywords;

    await redis.set(
      cacheKey, JSON.stringify(keywords),
      { expiration: { type:'EXAT', value: EXPIRE_AT } }
    );

    return keywords;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`JSON parsing error: ${error.message}, using fallback keywords`);
      return getFallbackKeywords();
    }
    console.error('Failed to parse GenAI response, using fallback keywords');
    return getFallbackKeywords();
  }
};

export const generateSpotifyQueries = async (
  weather: WeatherData,
  activity?: string,
  moods?: string[]
): Promise<SpotifyQueries> => {
  const cacheKey = `spotify-queries:${JSON.stringify(
    { weather, activity: activity || '', moods: moods || [] }
  )}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData) as SpotifyQueries;
      return parsed;
    } catch {
      // Fall through to regeneration.
    }
  }

  const promptWithContext = createSpotifyContextPrompt(weather, activity, moods);

  let responseText: string;
  try {
    responseText = await generateContentWithFallback(promptWithContext);
  } catch (error) {
    console.error('All models failed for Spotify queries, using fallback:', error);
    return getFallbackQueries(weather.main, moods, activity);
  }

  try {
    const generatedGenres = extractQueriesFromText(responseText);

    await redis.set(cacheKey, JSON.stringify(generatedGenres), {
      expiration: { type: 'EXAT', value: EXPIRE_AT },
    });

    return generatedGenres;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Spotify queries parsing error: ${error.message}, using fallback queries`);
      return getFallbackQueries(weather.main, moods, activity);
    }

    console.error('Failed to parse Spotify queries response, using fallback queries');
    return getFallbackQueries(weather.main, moods, activity);
  }
};
