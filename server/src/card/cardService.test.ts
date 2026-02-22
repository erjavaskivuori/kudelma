import { describe, it, expect, vi } from 'vitest';
import { createCard } from './cardService.js';
import * as cardRepository from './cardRepository.js';
import { HttpError } from '../utils/errors/HttpError.js';

const validSelection = {
  book: {
    id: 'book123',
    title: 'Test Book',
    authors: ['Author'],
    year: 2022,
  },
  artwork: {
    id: 'art456',
    title: 'Test Art',
    artist: 'Artist',
    year: 2021,
    imageUrl: 'http://example.com/art.jpg',
    authors: ['Artist'],
    buildings: ['Museum'],
    copyright: 'CC0',
  },
  recipe: {
    id: 789,
    title: 'Test Recipe',
    sourceUrl: 'http://example.com/recipe',
  },
};

describe('createCard service', () => {
  it('returns card id on successful creation', async () => {
    vi.spyOn(cardRepository, 'createCard').mockResolvedValue({
      id: 42,
      userId: 1,
      bookId: 'book123',
      artworkId: 'art456',
      recipeId: 789,
    });

    const result = await createCard(validSelection, 1);
    expect(result).toBe(42);
  });

  it('throws HttpError for duplicate card (P2002)', async () => {
    vi.spyOn(cardRepository, 'createCard').mockRejectedValue({ code: 'P2002' });

    await expect(createCard(validSelection, 1)).rejects.toThrow(HttpError);
    await expect(createCard(validSelection, 1)).rejects.toThrow(
      'Card with the same selection already exists for this user'
    );
  });

  it('throws generic error for other Prisma errors', async () => {
    vi.spyOn(cardRepository, 'createCard').mockRejectedValue({ code: 'P9999' });

    await expect(createCard(validSelection, 1)).rejects.toThrow();
  });

  it('throws error for unexpected errors', async () => {
    vi.spyOn(cardRepository, 'createCard').mockRejectedValue(new Error('Unexpected'));

    await expect(createCard(validSelection, 1)).rejects.toThrow('Unexpected');
  });
});
