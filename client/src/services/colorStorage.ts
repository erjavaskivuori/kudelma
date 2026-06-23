export type StoredColorRange = {
  colors: string[];
  updatedAt: number;
};

const STORAGE_KEY = 'kudelma.colorRange.v1';
const CUE_TTL_MS = 6 * 60 * 60 * 1000;

const isValidColorList = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(color => typeof color === 'string');
};

export const loadColorRange = (): string[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredColorRange>;

    if (!isValidColorList(parsed.colors) || typeof parsed.updatedAt !== 'number') {
      return null;
    }

    if (Date.now() - parsed.updatedAt > CUE_TTL_MS) {
      return null;
    }

    return parsed.colors.slice(0, 5);
  } catch {
    return null;
  }
};

export const storeColorRange = (colors: string[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        { colors: colors.slice(0, 5), updatedAt: Date.now() } satisfies StoredColorRange,
      ),
    );
  } catch {
    // Ignore storage failures and fall back to CSS defaults.
  }
};
