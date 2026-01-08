export type imageRights = {
  copyright: string;
  link: string;
  description: string[] | null;
}

export type nonPresenterAuthor = {
  name: string;
  role: string | null;
}

export type building = {
  value: string
  translated: string
}

export type Artwork = {
  id: string;
  title: string;
  year: number | null;
  imageUrl: string;
  authors: nonPresenterAuthor[];
  buildings: building[] | null;
  license: imageRights;
}
