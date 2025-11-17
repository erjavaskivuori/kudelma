import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GENAI_PROMPT = process.env.GENAI_PROMPT;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

if (!GENAI_PROMPT) {
  throw new Error('GENAI_PROMPT is not defined in environment variables');
}

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

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

const createContextualPrompt = (): string => {
  console.log(GENAI_PROMPT);
  const weather = {'Main': 'Clouds',
    'Temperature': '25.88°C',
    'Cloudiness': '75%'};

  const context = `{"date": ${new Date().toLocaleDateString()}, \
    "season": ${getSeason()}, \
    "time_of_day": ${getTimeOfDay()}, \
    "location": "Helsinki"}, \
    "weather": ${JSON.stringify(weather)}}, \
    "flag_day": ${false}}`;

  return `${GENAI_PROMPT}\nContext: ${context}`;
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

export const generateKeywords = async (): Promise<JSON> => {
  const promptWithContext = createContextualPrompt();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: promptWithContext,
  });

  if (!response || !response.text) {
    throw new Error('No response from GenAI');
  }
  console.log('GenAI response:', response.text);
  const jsonStr = extractJsonFromText(response.text);
  console.log('Extracted JSON:', jsonStr);

  try {
    const keywords = JSON.parse(jsonStr) as JSON;
    return keywords;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error:', error.message);
    }
    throw new Error('Failed to parse JSON from GenAI response');
  }
};
