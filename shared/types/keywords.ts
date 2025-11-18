export interface Keywords {
  colors: string[];
  books: string[];
  movies: string[];
  music: string[];
  art: string[];
  recipes: string[];
}

export interface UseKeywordsReturn {
  keywords: Keywords | null;
  loading: boolean;
  error: string | null;
}
