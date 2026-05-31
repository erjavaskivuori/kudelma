import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { Keywords, SpotifySearchQueries } from './genAITypes.js';
import type { WeatherData } from '../../../shared/types/weather.js';
import { redis } from '../infra/redis.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';

const EXPIRE_AT = getNextChangeTimestamp();

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GENAI_PROMPT = process.env.GENAI_PROMPT;
const GENAI_MUSIC_PROMPT = process.env.GENAI_MUSIC_PROMPT;
const GENAI_MODEL = 'gemini-2.5-flash';

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

const getFallbackSpotifyQueries = (
  weather: WeatherData,
  activity: string,
  moods: string[]
): SpotifySearchQueries => {
  const moodSeed = moods.find((mood) => mood.trim().length > 0)?.trim() || 'chill';
  const weatherSeed = weather.main?.trim() || weather.city.trim() || 'weather';
  const activitySeed = activity.trim() || 'listening';
  const seasonSeed = getSeason();

  return {
    playlist: dedupeQueries([
      `${weatherSeed} ${activitySeed}`,
      `${moodSeed} ${activitySeed}`,
      `${seasonSeed} ${moodSeed} vibes`,
      `${weather.city} ${moodSeed} mix`,
      `${activitySeed} focus`,
    ]),
    track: dedupeQueries([
      'genre:lofi',
      'genre:ambient',
      'genre:jazz',
      `genre:${moodSeed}`,
      `genre:${seasonSeed}`,
    ]),
  };
};

const extractSpotifyQueriesFromText = (text: string): SpotifySearchQueries => {
  const jsonStr = extractJsonFromText(text);
  const parsed = JSON.parse(jsonStr) as Partial<SpotifySearchQueries>;

  return {
    playlist: sanitizeQueryList(parsed.playlist),
    track: sanitizeQueryList(parsed.track),
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
  let response;
  try {
    response = await ai.models.generateContent({
      model: GENAI_MODEL,
      contents: promptWithContext,
    });
  } catch (error) {
    console.error('Error generating content from GenAI:', error, 'using fallback keywords');
    return getFallbackKeywords();
  }

  if (!response || !response.text) {
    console.error('No response from GenAI, using fallback keywords');
    return getFallbackKeywords();
  }
  const jsonStr = extractJsonFromText(response.text);

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

export const generateSpotifySearchQueries = async (
  weather: WeatherData,
  activity?: string,
  moods?: string[]
): Promise<SpotifySearchQueries> => {
  const cacheKey = `spotify-queries:${JSON.stringify(
    { weather, activity: activity || '', moods: moods || [] }
  )}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData) as SpotifySearchQueries;
      return parsed;
    } catch {
      // Fall through to regeneration.
    }
  }

  const promptWithContext = createSpotifyContextPrompt(weather, activity, moods);

  let response;
  try {
    response = await ai.models.generateContent({
      model: GENAI_MODEL,
      contents: promptWithContext,
    });
  } catch (error) {
    console.error('Error generating Spotify queries from GenAI:', error, 'using fallback queries');
    return getFallbackSpotifyQueries(weather, activity || '', moods || []);
  }

  if (!response || !response.text) {
    console.error('No Spotify query response from GenAI, using fallback queries');
    return getFallbackSpotifyQueries(weather, activity || '', moods || []);
  }

  try {
    const generatedQueries = extractSpotifyQueriesFromText(response.text);

    await redis.set(cacheKey, JSON.stringify(generatedQueries), {
      expiration: { type: 'EXAT', value: EXPIRE_AT },
    });

    return generatedQueries;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Spotify query parsing error: ${error.message}, using fallback queries`);
      return getFallbackSpotifyQueries(weather, activity || '', moods || []);
    }

    console.error('Failed to parse Spotify query response, using fallback queries');
    return getFallbackSpotifyQueries(weather, activity || '', moods || []);
  }
};
