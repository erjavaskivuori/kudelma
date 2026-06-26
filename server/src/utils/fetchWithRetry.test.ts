import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from './fetchWithRetry.js';

const mockFetch = vi.fn();
global.fetch = mockFetch;

// Replace setTimeout with an immediate no-op so retry delays don't slow tests
vi.stubGlobal('setTimeout', (fn: () => void) => {
  fn();
  return 0 as unknown as ReturnType<typeof setTimeout>;
});

interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

const makeResponse = (ok: boolean, status: number): MockResponse => ({
  ok,
  status,
  json: vi.fn(),
});

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns immediately on a successful response', async () => {
    mockFetch.mockResolvedValue(makeResponse(true, 200));
    await fetchWithRetry('http://example.com');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('returns immediately on a non-retryable 4xx error', async () => {
    mockFetch.mockResolvedValue(makeResponse(false, 404));
    const response = await fetchWithRetry('http://example.com');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(404);
  });

  it('retries on 500 and succeeds on second attempt', async () => {
    mockFetch
      .mockResolvedValueOnce(makeResponse(false, 500))
      .mockResolvedValueOnce(makeResponse(true, 200));

    const response = await fetchWithRetry('http://example.com');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(response.ok).toBe(true);
  });

  it('exhausts all attempts and returns the last 500 response', async () => {
    mockFetch.mockResolvedValue(makeResponse(false, 500));

    const response = await fetchWithRetry('http://example.com', 3);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('retries on 502, 503, and 504 as well', async () => {
    for (const status of [502, 503, 504]) {
      vi.clearAllMocks();
      mockFetch
        .mockResolvedValueOnce(makeResponse(false, status))
        .mockResolvedValueOnce(makeResponse(true, 200));

      await fetchWithRetry('http://example.com');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    }
  });
});
