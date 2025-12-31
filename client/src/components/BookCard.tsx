import type { DisplayBook as Book } from "../../../shared/types/books";

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
      <img 
        className="rounded-t-2xl object-cover w-full" 
        src={proxiedImageUrl} 
        alt={book.title}
        onError={handleImageError}
        loading="lazy"
      />
      <div className="p-6">
        <h5 className="mt-1 mb-1 font-semibold tracking-tight text-heading">
          {book.title} <br />
          {book.authors.join(', ')}, {book.year} <br />
        </h5>
      </div>
    </div>
  );
};

export default BookCard;
