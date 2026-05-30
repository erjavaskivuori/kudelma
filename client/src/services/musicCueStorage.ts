export type MusicCues = {
  activity: string | null;
  moods: string[];
  skipped: boolean;
  updatedAt: number;
};

export const DEFAULT_CUES: MusicCues = {
  activity: null,
  moods: [],
  skipped: false,
  updatedAt: 0,
};

const CUE_TTL_MS = 6 * 60 * 60 * 1000;

const storageKey = (userId: number) => `kudelma.musicCues.v1.${userId}`;

export const loadCues = (userId: number): MusicCues => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return DEFAULT_CUES;

    const parsed = JSON.parse(raw) as Partial<MusicCues>;

    if (typeof parsed.updatedAt === 'number' && Date.now() - parsed.updatedAt > CUE_TTL_MS) {
      return DEFAULT_CUES;
    }

    return {
      activity: typeof parsed.activity === 'string' ? parsed.activity : null,
      moods: Array.isArray(parsed.moods) ? parsed.moods.slice(0, 2) : [],
      skipped: Boolean(parsed.skipped),
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    };
  } catch {
    return DEFAULT_CUES;
  }
};

export const storeCues = (cues: MusicCues, userId: number): void => {
  localStorage.setItem(storageKey(userId), JSON.stringify(cues));
};
