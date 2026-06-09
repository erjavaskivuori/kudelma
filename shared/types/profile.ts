import type { PostCard } from './card';

export type CardVisibility = 'PRIVATE' | 'PUBLIC';

export type ProfileUser = {
  id: number;
  name: string;
  cardsVisibility: CardVisibility;
};

export type ProfileCardsResponse = {
  profile: ProfileUser;
  cardsVisible: boolean;
  cards: PostCard[];
};
