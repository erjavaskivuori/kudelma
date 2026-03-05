import { useState, type ReactNode } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";

interface FeedCardProps {
  image: ReactNode;
  title: ReactNode;
  details: ReactNode;
  overlayDetails?: ReactNode;
  onFavoriteSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
}

const FeedCard = ({
  image,
  title,
  details,
  overlayDetails,
  onFavoriteSelect,
  selected
}: FeedCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs
        overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          className="inline-flex items-center justify-center text-white bg-[var(--color-popup)]/60
            hover:bg-[var(--color-dark)]/90 shadow-xs rounded-lg w-8 h-8"
          onClick={onFavoriteSelect}
          aria-pressed={selected}
        >
          {selected ? (
            <PiHeartFill className="w-5 h-5" />
          ) : (
            <PiHeart className="w-5 h-5" />
          )}
          <span className="sr-only">Heart icon, select this card as a favorite</span>
        </button>
      </div>

      {image}

      {/* Title and details — always visible at bottom */}
      <div className="px-4 py-3">
        <h5 className="font-semibold tracking-tight text-heading leading-snug">
          {title}
        </h5>
        <p>{details}</p>
      </div>

      {overlayDetails && (
        <>
          {/* Overlay — covers entire card on hover */}
          <div
            className={`absolute inset-0 rounded-2xl bg-[var(--color-dark)] flex flex-col
              justify-center px-5 py-4 transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <h5 className="font-semibold tracking-tight text-heading leading-snug mb-3">
              {title}
            </h5>
            <div className="text-sm text-heading/80">
              {details} <br />
              {overlayDetails}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedCard;
