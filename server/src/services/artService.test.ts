import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchArtworksByKeywords } from './artService.js';
import { HttpError } from '../utils/errors/HttpError.js';

const mockFetch = vi.fn();
global.fetch = mockFetch;

interface MockResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  json: () => Promise<unknown>;
}

describe('artService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchArtworksByKeywords', () => {
    const mockFinnaApiResponse = {
      resultCount: 3,
      records: [
        {
          id: 'test.artwork-with-image1',
          title: 'Syksy',
          year: '1941',
          imageRights: {
            copyright: 'CC0',
            link: 'http://creativecommons.org/publicdomain/zero/1.0/deed.fi'
          },
          images: [
            '/Cover/Show?source=Solr&id=test.artwork-with-image1&index=0&size=large'
          ],
          nonPresenterAuthors: [
            {
              name: 'Test, Artist A',
              role: 'taiteilija'
            }
          ],
          buildings: [
            {
              value: '0/Kansallisgalleria Ateneumin taidemuseo/',
              translated: 'Kansallisgalleria / Ateneumin taidemuseo'
            }
          ]
        },
        {
          id: 'test.artwork-with-image2',
          title: 'Syksy',
          year: '1916',
          imageRights: {
            copyright: 'CC BY 4.0',
            link: 'http://creativecommons.org/licenses/by/4.0/deed.fi',
            description: [
              'Description of the image rights and usage terms.'
            ]
          },
          images: [
            '/Cover/Show?source=Solr&id=test.artwork-with-image2&index=0&size=large'
          ],
          nonPresenterAuthors: [
            {
              name: 'Test, Artist B',
              role: 'taiteilija'
            }
          ],
          buildings: [
            {
              value: '0/loviisankaupunginmuseo/',
              translated: 'Loviisan kaupunginmuseo'
            }
          ]
        },
        {
          id: 'test.artwork-without-image',
          title: 'Artwork Without Image',
          year: '1980',
          imageRights: {
            copyright: 'CC BY 4.0',
            link: 'http://creativecommons.org/licenses/by/4.0/deed.fi'
          },
          images: [], // No images - should be filtered out
          nonPresenterAuthors: [
            {
              name: 'Test, Artist C',
              role: 'taiteilija'
            }
          ],
          buildings: [
            {
              value: '0/testimuseo/',
              translated: 'Testimuseo'
            }
          ]
        }
      ],
      status: 'OK'
    };

    const expectedArtworks = [
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
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockFinnaApiResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchArtworksByKeywords(['autumn', 'fall']);

      expect(result).toEqual(expectedArtworks);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lookfor%5B%5D=autumn%2BOR%2Bfall')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('filter%5B%5D=%7Eformat%3A%221%2FWorkOfArt%2FPainting%2F%22')
      );
    });

    it('should handle single keyword', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockFinnaApiResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchArtworksByKeywords(['nature']);

      expect(result).toEqual(expectedArtworks);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lookfor%5B%5D=nature')
      );
    });

    it('should use custom limit parameter', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockFinnaApiResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await fetchArtworksByKeywords(['art'], 50);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=50')
      );
    });

    it('should filter out artworks without images', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockFinnaApiResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchArtworksByKeywords(['art']);

      // Should only return 2 artworks (the one without images is filtered out)
      expect(result).toHaveLength(2);
      expect(result.every(artwork => artwork.imageUrl)).toBe(true);
    });

    it('should handle artworks with missing year', async () => {
      const mockResponseWithMissingYear = {
        resultCount: 1,
        records: [
          {
            id: 'test.artwork-no-year',
            title: 'Ancient Artwork',
            year: '', // Empty year
            imageRights: {
              copyright: 'CC BY 4.0',
              link: 'http://creativecommons.org/licenses/by/4.0/deed.fi'
            },
            images: ['/Cover/Show?source=Solr&id=test.artwork-no-year&index=0&size=large'],
            nonPresenterAuthors: [{ name: 'Unknown Artist', role: 'taiteilija' }],
            buildings: [{ value: '0/testi museo/', translated: 'Testi museo' }],
          },
        ],
        status: 'OK',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponseWithMissingYear),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchArtworksByKeywords(['ancient']);

      expect(result).toHaveLength(1);
      expect(result[0]?.year).toBeNull();
    });

    it('should handle empty records array', async () => {
      const mockEmptyResponse = {
        resultCount: 0,
        records: [],
        status: 'OK',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockEmptyResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchArtworksByKeywords(['nonexistent']);

      expect(result).toEqual([]);
    });

    it('should throw HttpError for 404 status', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Finna API error: 404 Not Found', 404)
      );
    });

    it('should throw HttpError for 500 status', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Finna API error: 500 Internal Server Error', 500)
      );
    });

    it('should throw HttpError for invalid response structure', async () => {
      const mockInvalidResponse = {
        // Missing records array
        resultCount: 0,
        status: 'OK',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockInvalidResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Invalid response structure from Finna API', 500)
      );
    });

    it('should throw HttpError for non-array records', async () => {
      const mockInvalidResponse = {
        resultCount: 0,
        records: 'not-an-array',
        status: 'OK',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockInvalidResponse),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Invalid response structure from Finna API', 500)
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Failed to fetch artworks: Network error', 500)
      );
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchArtworksByKeywords(['test'])).rejects.toThrow(
        new HttpError('Failed to fetch artworks: Invalid JSON', 500)
      );
    });

    it('should construct correct API URL with all required parameters', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ resultCount: 0, records: [], status: 'OK' }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await fetchArtworksByKeywords(['test', 'art']);

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;

      expect(calledUrl).toContain('https://api.finna.fi/v1/search');
      expect(calledUrl).toContain('lookfor%5B%5D=test%2BOR%2Bart');
      expect(calledUrl).toContain('type0%5B%5D=AllFields');
      expect(calledUrl).toContain('filter%5B%5D=%7Eformat%3A%221%2FWorkOfArt%2FPainting%2F%22');
      expect(calledUrl).toContain('field%5B%5D=id');
      expect(calledUrl).toContain('field%5B%5D=title');
      expect(calledUrl).toContain('field%5B%5D=year');
      expect(calledUrl).toContain('field%5B%5D=images');
      expect(calledUrl).toContain('limit=100');
    });

    it('should include Creative Commons license filters in URL', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ resultCount: 0, records: [], status: 'OK' }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await fetchArtworksByKeywords(['test']);

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;

      expect(calledUrl).toContain('%7Eusage_rights_ext_str_mv%3A%220%2FA+Free%2F%22');
      expect(calledUrl).toContain('%7Eusage_rights_ext_str_mv%3A%220%2FB+BY%2F%22');
      expect(calledUrl).toContain('%7Eusage_rights_ext_str_mv%3A%220%2FE+NC-ND%2F%22');
      expect(calledUrl).toContain('%7Eusage_rights_ext_str_mv%3A%220%2FD+ND%2F%22');
    });
  });
});
