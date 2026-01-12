import type { Book } from "../../../shared/types/books";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(book.coverUrl)}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', book.title);
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs">
      <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">
        <img 
        className="rounded-t-2xl object-cover w-full" 
        src={proxiedImageUrl} 
        alt={book.title}
        onError={handleImageError}
      />
      </a>
      <div className="p-6">
        <h5 className="mt-1 mb-1 font-semibold tracking-tight text-heading">
          <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">{book.title}</a>
        </h5>
        <p>
          {book.authors.join(', ')}, {book.year}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
