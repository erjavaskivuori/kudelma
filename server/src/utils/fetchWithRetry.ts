const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);
const RETRY_DELAY_MS = 200;

export const fetchWithRetry = async (
  url: string,
  maxAttempts = 3,
): Promise<Response> => {
  let lastResponse: Response | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url);
    if (response.ok || !RETRYABLE_STATUSES.has(response.status)) {
      return response;
    }
    lastResponse = response;
    if (attempt < maxAttempts) {
      await new Promise(resolve =>
        setTimeout(resolve, RETRY_DELAY_MS * attempt)
      );
    }
  }

  return lastResponse!;
};
