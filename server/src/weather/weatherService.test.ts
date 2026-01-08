import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherByCoordinates } from './weatherService.js';
import { HttpError } from '../utils/errors/HttpError.js';

const mockFetch = vi.fn();
global.fetch = mockFetch;

interface MockResponse {
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
}

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPEN_WEATHER_API_KEY = 'test-api-key';
  });

  describe('fetchWeatherByCoordinates', () => {
    const mockOpenWeatherData = {
      name: 'Helsinki',
      weather: [{ main: 'Clear' }],
      main: { temp: 15.5 },
      clouds: { all: 20 },
      sys: {
        sunrise: 1633072800,
        sunset: 1633116000,
      },
    };

    const expectedWeatherData = {
      city: 'Helsinki',
      main: 'Clear',
      temperature: 15.5,
      cloudiness: 20,
      sunrise: '6:12:34',
      sunset: '22:45:56',
    };

    it('should return weather data for valid coordinates', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockOpenWeatherData),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchWeatherByCoordinates(60.1695, 24.9354);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=60.1695&lon=24.9354&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(expectedWeatherData);
    });

    it('should handle missing weather data gracefully', async () => {
      const mockOpenWeatherDataMissingWeather = {
        name: 'Helsinki',
        weather: [], // Empty weather array
        main: { temp: 15.5 },
        clouds: { all: 20 },
        sys: {
          sunrise: 1633072800,
          sunset: 1633116000,
        },
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockOpenWeatherDataMissingWeather),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchWeatherByCoordinates(60.1695, 24.9354);

      expect(result).toEqual({
        city: 'Helsinki',
        main: undefined,
        temperature: 15.5,
        cloudiness: 20,
        sunrise: '6:12:34',
        sunset: '22:45:56',
      });
    });

    it('should throw HttpError with 404 status when coordinates are not found', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 404,
        json: vi.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchWeatherByCoordinates(999, 999)).rejects.toThrow(
        new HttpError('Failed to fetch weather data', 404)
      );
    });

    it('should throw HttpError with 401 status when API key is invalid', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 401,
        json: vi.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchWeatherByCoordinates(60.1695, 24.9354)).rejects.toThrow(
        new HttpError('Failed to fetch weather data', 401)
      );
    });

    it('should throw HttpError with 500 status for server errors', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 500,
        json: vi.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchWeatherByCoordinates(60.1695, 24.9354)).rejects.toThrow(
        new HttpError('Failed to fetch weather data', 500)
      );
    });

    it('should construct the correct API URL with coordinates and API key', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockOpenWeatherData),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await fetchWeatherByCoordinates(60.1695, 24.9354);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=60.1695&lon=24.9354&appid=test-api-key&units=metric'
      );
    });

    it('should handle negative coordinates correctly', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockOpenWeatherData),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await fetchWeatherByCoordinates(-60.1695, -24.9354);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=-60.1695&lon=-24.9354&appid=test-api-key&units=metric'
      );
    });
  });
});
