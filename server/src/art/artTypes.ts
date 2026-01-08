import type { imageRights, nonPresenterAuthor, building } from '../../../shared/types/art.ts';

export type FinnaApiResponse = {
  records: FinnaRecord[];
  resultCount: number;
  status: string;
};

export type FinnaRecord = {
  id: string;
  title: string;
  year: string;
  imageRights: imageRights;
  images: string[];
  nonPresenterAuthors: nonPresenterAuthor[];
  buildings: building[];
};
