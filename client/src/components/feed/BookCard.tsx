import type { Book } from "../../../../shared/types/books";
import FeedCard from "./FeedCard";

interface BookCardProps {
  book: Book;
  type: string;
}

const BookCard = ({ book, type }: BookCardProps) => {
  const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(book.coverUrl)}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', book.title);
    e.currentTarget.style.display = 'none';
  };

  return (
    <FeedCard
      type={type}
      image={
        <>
        <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">
          <img
            className="rounded-t-2xl object-cover w-full"
            src={proxiedImageUrl}
        alt={book.title}
        onError={handleImageError}
      />
      </a>
      </>
      }
      title={
          <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">{book.title}</a>
      }
      details={
        <>{book.authors.join(', ')}, {book.year}</>
        }
      />
  );
};

export default BookCard;
