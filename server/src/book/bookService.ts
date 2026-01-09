import { HttpError } from '../utils/errors/HttpError.js';
import type { OpenLibraryBook, BookSubjectResponse } from './bookTypes.js';
import type { Book } from '../../../shared/types/books.js';
import { redis } from '../infra/redis.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';

const EXPIRE_AT = getNextChangeTimestamp();

const transformBookToDisplayBook = (book: OpenLibraryBook) => {
  // Skip books without cover images
  if (!book.cover_id && !book.cover_edition_key) {
    return null;
  }

  const displayBook = {
    id: book.key,
    title: book.title,
    authors: book.authors ? book.authors.map(author => author.name) : [],
    year: book.first_publish_year || null,
    coverUrl: book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
      : book.cover_edition_key
        ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`
        : ''
  };
  return displayBook;
};

export const fetchBooksByKeywords = async (keywords: string[]) => {
  const cacheKey = `books:${keywords.sort().join(',')}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData) as Book[];
  }

  const books: Book[] = [];

  for (let i = 0; i < keywords.length; i++) {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    const keyword = keywords[randomIndex];
    console.log(`Fetching books for keyword: ${keyword}`);

    const response: Response = await fetch(`http://openlibrary.org/subjects/${keyword}.json?limit=40`);
    if (!response.ok) {
      throw new HttpError('Failed to fetch book data', response.status);
    }
    const data: BookSubjectResponse = await response.json() as BookSubjectResponse;

    console.log(data);

    // If no works found for this keyword, continue to next
    if (data.work_count === 0) {
      continue;
    }

    const booksForKeyword: Book[] = data.works.map(
      book => transformBookToDisplayBook(book)
    ).filter(book => book !== null) as Book[];

    // Add books to the main list
    books.push(...booksForKeyword);

    // If less than 10 books found, try next keyword
    if (data.work_count < 10 && i < keywords.length - 1) {
      continue;
    }

    await redis.set(
      cacheKey, JSON.stringify(books),
      { expiration: { type:'EXAT', value: EXPIRE_AT } }
    );
    return books;
  }
  throw new HttpError('No books found for the given keywords', 404);
};
