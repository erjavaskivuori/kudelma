import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../app.js';
import * as artService from '../services/artService.js';
import { HttpError } from '../utils/errors/HttpError.js';

vi.mock('../services/artService.js');

const mockFetchArtworksByKeywords = vi.spyOn(artService, 'fetchArtworksByKeywords');

describe('artController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /art', () => {
    const mockArtworks = [
      {
        id: 'test.artwork-with-image1',
        title: 'Syksy',
        year: 1941,
        authors: [{ name: 'Test, Artist A', role: 'taiteilija' }],
        imageUrl: '/Cover/Show?source=Solr&id=test.artwork-with-image1&index=0&size=large',
        buildings: [{
          value: '0/Kansallisgalleria Ateneumin taidemuseo/',
          translated: 'Kansallisgalleria / Ateneumin taidemuseo'
        }],
      },
      {
        id: 'test.artwork-with-image2',
        title: 'Syksy',
        year: 1916,
        authors: [{ name: 'Test, Artist B', role: 'taiteilija' }],
        imageUrl: '/Cover/Show?source=Solr&id=test.artwork-with-image2&index=0&size=large',
        buildings: [{ value: '0/loviisankaupunginmuseo/', translated: 'Loviisan kaupunginmuseo' }],
      },
    ];

    it('should return artworks for valid keywords', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=syksy,ruska');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ artwork: mockArtworks });
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['syksy', 'ruska']);
    });

    it('should handle single keyword', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=luonto');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ artwork: mockArtworks });
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['luonto']);
    });

    it('should trim whitespace from keywords', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords= syksy , ruska , luonto ');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['syksy', 'ruska', 'luonto']);
    });

    it('should return 400 if keywords parameter is missing', async () => {
      const response = await request(app).get('/art');

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error)
        .toBe('Keywords query parameter is missing or invalid');
    });

    it('should return 400 if keywords is not a string', async () => {
      const response = await request(app)
        .get('/art?keywords[]=syksy&keywords[]=luonto');

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error)
        .toBe('Keywords query parameter is missing or invalid');
    });

    it('should return 400 if keywords is empty string', async () => {
      const response = await request(app)
        .get('/art?keywords=');

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error).toBe('At least one keyword is required');
    });

    it('should return 400 if keywords contains only whitespace', async () => {
      const response = await request(app)
        .get('/art?keywords=   ');

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error).toBe('At least one keyword is required');
    });

    it('should return 400 if any keyword is empty after trimming', async () => {
      const response = await request(app)
        .get('/art?keywords=syksy,,luonto');

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error)
        .toBe('All keywords must be non-empty strings');
    });

    it('should return 400 if more than 10 keywords are provided', async () => {
      const manyKeywords = Array.from({ length: 11 }, (_, i) => `keyword${i + 1}`).join(',');

      const response = await request(app)
        .get(`/art?keywords=${manyKeywords}`);

      expect(response.status).toBe(400);
      expect((response.body as { error: string }).error).toBe('Maximum 10 keywords allowed');
    });

    it('should return empty array when no artworks found', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue([]);

      const response = await request(app)
        .get('/art?keywords=nonexistent');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ artwork: [] });
    });

    it('should handle service throwing HttpError', async () => {
      mockFetchArtworksByKeywords.mockRejectedValue(
        new HttpError('Finna API error: 404 Not Found', 404)
      );

      const response = await request(app)
        .get('/art?keywords=test');

      expect(response.status).toBe(404);
      expect((response.body as { error: string }).error).toBe('Finna API error: 404 Not Found');
    });

    it('should handle service throwing generic error', async () => {
      mockFetchArtworksByKeywords.mockRejectedValue(
        new Error('Network error')
      );

      const response = await request(app)
        .get('/art?keywords=test');

      expect(response.status).toBe(500);
      expect((response.body as { error: string }).error).toBe('Network error');
    });

    it('should handle special characters in keywords', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=ä,ö,å,é');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['ä', 'ö', 'å', 'é']);
    });

    it('should handle URL encoded keywords', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=syksy%20maalaus,taide%20museo');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['syksy maalaus', 'taide museo']);
    });

    it('should handle keywords with spaces', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=abstract art,oil painting');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['abstract art', 'oil painting']);
    });

    it('should preserve case in keywords', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=Syksy,MAALAUS,TaiDe');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith(['Syksy', 'MAALAUS', 'TaiDe']);
    });

    it('should handle mixed valid and invalid characters', async () => {
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get('/art?keywords=art-123,painting_modern,design&');

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith([
        'art-123', 
        'painting_modern', 
        'design'
      ]);
    });

    it('should handle very long keyword strings', async () => {
      const longKeyword = 'a'.repeat(100);
      mockFetchArtworksByKeywords.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .get(`/art?keywords=${longKeyword}`);

      expect(response.status).toBe(200);
      expect(mockFetchArtworksByKeywords).toHaveBeenCalledWith([longKeyword]);
    });
  });
});
