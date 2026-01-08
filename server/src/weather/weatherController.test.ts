import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../app.js';
import * as weatherService from './weatherService.js';

vi.mock('../services/weatherService.js');

const mockFetchWeatherByCoordinates = vi.spyOn(weatherService, 'fetchWeatherByCoordinates');

describe('GET /weather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if latitude or longitude is missing', async () => {
    const res = await request(app).get('/weather');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Latitude and longitude are required' });
  });

  it('returns weather data for valid coordinates', async () => {
    const mockWeather = {
      city: 'Helsinki',
      main: 'Clear',
      temperature: 15,
      cloudiness: 0,
      sunrise: '6:12:34',
      sunset: '22:45:56',
    };

    mockFetchWeatherByCoordinates.mockResolvedValue(mockWeather);

    const res = await request(app).get('/weather?latitude=60.1695&longitude=24.9354');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ weather: mockWeather });
    expect(mockFetchWeatherByCoordinates).toHaveBeenCalledWith(60.1695, 24.9354);
  });

  it('returns 500 if service throws unexpected error', async () => {
    mockFetchWeatherByCoordinates.mockRejectedValue(new Error('Failed to fetch weather data'));

    const res = await request(app).get('/weather?latitude=60.1695&longitude=24.9354');

    expect(res.status).toBe(500);
    expect((res.body as { error: string }).error).toBe('Failed to fetch weather data');
  });
});
