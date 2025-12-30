import { HttpError } from '../utils/errors/HttpError.js';
import type {
  Artwork,
  imageRights,
  nonPresenterAuthor,
  building
} from '../../../shared/types/art.ts';
import { redis } from '../infra/redis.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';

interface FinnaApiResponse {
  records: FinnaRecord[];
  resultCount: number;
  status: string;
}

interface FinnaRecord {
  id: string;
  title: string;
  year: string;
  imageRights: imageRights;
  images: string[];
  nonPresenterAuthors: nonPresenterAuthor[];
  buildings: building[];
}

const EXPIRE_AT = getNextChangeTimestamp();
const FINNA_API_BASE = 'https://api.finna.fi/v1/search';
const DEFAULT_LIMIT = 40;

const CC_LICENSES = {
  'cc-0': '0/A Free/', // Free usage
  'cc-by': '0/B BY/', // Attribution
  'cc-nc-nd': '0/E NC-ND/', // NonCommercial-NoDerivatives
  'cc-nd': '0/D ND/', // NoDerivatives
} as const;

const INCLUDE_FIELDS = [
  'id',
  'title',
  'year',
  'imageRights',
  'images',
  'nonPresenterAuthors',
  'buildings'
] as const;

const ccLicense = (license: keyof typeof CC_LICENSES): string | null => {
  return CC_LICENSES[license] || null;
};

const buildFinnaUrl = (keywords: string[], limit = DEFAULT_LIMIT): string => {
  const params: string[] = [];

  const searchTerms = keywords.join('+OR+');
  params.push(`lookfor[]=${searchTerms}`);

  // Search keywords in all fields
  params.push('type0[]=AllFields');

  params.push('filter[]=~format:"1/WorkOfArt/Painting/"');

  Object.keys(CC_LICENSES).forEach(license => {
    const licenseValue = ccLicense(license as keyof typeof CC_LICENSES);
    if (licenseValue) {
      params.push(`filter[]=~usage_rights_ext_str_mv:"${licenseValue}"`);
    }
  });

  INCLUDE_FIELDS.forEach(field => {params.push(`field[]=${field}`);});
  params.push(`limit=${limit.toString()}`);
  const url = `${FINNA_API_BASE}?${params.join('&')}`;

  return url;
};

const transformFinnaRecordToArtwork = (record: FinnaRecord): Artwork | null => {
  const imageUrl = record.images?.[0];

  if (!imageUrl) {
    return null;
  }

  const uniqueAuthors = record.nonPresenterAuthors.filter((author, index, array) =>
    array.findIndex(a => a.name === author.name) === index
  );

  return {
    id: record.id,
    title: record.title,
    year: record.year ? parseInt(record.year, 10) : null,
    authors: uniqueAuthors,
    imageUrl: imageUrl,
    buildings: record.buildings || null,
  };
};

export const fetchArtworksByKeywords = async (keywords: string[], limit = DEFAULT_LIMIT) => {
  const cacheKey = `artworks:${keywords.sort().join(',')}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData) as Artwork[];
  }

  const url = buildFinnaUrl(keywords, limit);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new HttpError(
        `Finna API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: FinnaApiResponse = await response.json() as FinnaApiResponse;
    if (!data.records || !Array.isArray(data.records)) {
      throw new HttpError('Invalid response structure from Finna API', 500);
    }

    const artworks = data.records
      .map(transformFinnaRecordToArtwork)
      .filter((artwork): artwork is Artwork => artwork !== null);

    await redis.set(
      cacheKey, JSON.stringify(artworks),
      { expiration: { type:'EXAT', value: EXPIRE_AT } }
    );
    return artworks;

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(
      `Failed to fetch artworks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
};
