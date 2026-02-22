import { describe, it, expect, vi, afterEach } from 'vitest';
import { createCardController } from './cardController.js';
import * as cardService from './cardService.js';
import { HttpError } from '../utils/errors/HttpError.js';
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

type MockReq = Partial<Request> & { body?: unknown; user?: unknown };
type MockRes = Partial<Response> & {
  status: (code: number) => MockRes;
  json: (data: unknown) => MockRes;
};

const mockReq = (body: unknown = {}, user: string | JwtPayload = {}): MockReq => ({
  body,
  user,
});

const mockRes = (): MockRes => {
  const res = {} as MockRes;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('createCardController', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a card and returns 201', async () => {
    vi.spyOn(cardService, 'createCard').mockResolvedValue(42);

    const req = mockReq(
      {
        book: { id: 'book123', title: 'Book', authors: ['A'], year: 2022 },
        artwork: {
          id: 'art456',
          title: 'Art',
          artist: 'B',
          year: 2021,
          imageUrl: '',
          authors: ['B'],
          buildings: ['Museum'],
          copyright: 'CC0',
        },
        recipe: { id: 789, title: 'Recipe', sourceUrl: '' },
      },
      { id: 1, name: 'Test User' }
    );
    const res = mockRes();

    await createCardController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(42);
  });

  it('returns 400 for validation error', async () => {
    const req = mockReq(
      { book: {}, artwork: {}, recipe: {} },
      { id: 1, name: 'Test User' }
    );
    const res = mockRes();

    let errorCaught = false;
    try {
      await createCardController(req as Request, res as Response);
    } catch (e) {
      errorCaught = true;
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(400);
    }
    expect(errorCaught).toBe(true);
  });

  it('returns 409 for duplicate error', async () => {
    vi.spyOn(cardService, 'createCard').mockRejectedValue(
      new HttpError('Card with the same selection already exists for this user', 409)
    );

    const req = mockReq(
      {
        book: { id: 'book123', title: 'Book', authors: ['A'], year: 2022 },
        artwork: {
          id: 'art456',
          title: 'Art',
          artist: 'B',
          year: 2021,
          imageUrl: '',
          authors: ['B'],
          buildings: ['Museum'],
          copyright: 'CC0',
        },
        recipe: { id: 789, title: 'Recipe', sourceUrl: '' },
      },
      { id: 1, name: 'Test User' }
    );
    const res = mockRes();

    let errorCaught = false;
    try {
      await createCardController(req as Request, res as Response);
    } catch (e) {
      errorCaught = true;
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(409);
    }
    expect(errorCaught).toBe(true);
  });

  it('returns 500 for generic error', async () => {
    vi.spyOn(cardService, 'createCard').mockRejectedValue(new Error('Unexpected'));

    const req = mockReq(
      {
        book: { id: 'book123', title: 'Book', authors: ['A'], year: 2022 },
        artwork: {
          id: 'art456',
          title: 'Art',
          artist: 'B',
          year: 2021,
          imageUrl: '',
          authors: ['B'],
          buildings: ['Museum'],
          copyright: 'CC0',
        },
        recipe: { id: 789, title: 'Recipe', sourceUrl: '' },
      },
      { id: 1, name: 'Test User' }
    );
    const res = mockRes();

    let errorCaught = false;
    try {
      await createCardController(req as Request, res as Response);
    } catch (e) {
      errorCaught = true;
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('Unexpected');
    }
    expect(errorCaught).toBe(true);
  });
});
