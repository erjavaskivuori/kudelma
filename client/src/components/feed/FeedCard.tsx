import { useState, type ReactNode } from "react";

interface FeedCardProps {
  type: string;
  image: ReactNode;
  title: ReactNode;
  details: ReactNode;
  overlayDetails?: ReactNode;
}

const FeedCard = ({ type, image, title, details, overlayDetails }: FeedCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(type); // type variable will be used later
  return (
    <div
      className="relative bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs
        overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

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
