export interface imageRights {
  copyright: string;
  link: string;
  description: string[] | null;
}

export interface nonPresenterAuthor {
  name: string;
  role: string | null;
}

export interface building {
  value: string
  translated: string
}

export interface Artwork {
  id: string;
  title: string;
  year: number | null;
  imageUrl: string;
  authors: nonPresenterAuthor[];
  buildings: building[] | null;
}

