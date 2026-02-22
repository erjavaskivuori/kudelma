import { useState } from "react";
import type { Artwork } from "../../../../shared/types/art";

interface ArtCardProps {
  artwork: Artwork;
}

const ArtCard = ({ artwork }: ArtCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProxiedImageUrl = (originalImageUrl: string): string => {
    const fullImageUrl = `https://api.finna.fi${originalImageUrl}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullImageUrl)}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', artwork.title);
    e.currentTarget.style.display = 'none';
  };

  return (
    <div
      className="relative bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs
        overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="rounded-t-2xl w-full"
        src={getProxiedImageUrl(artwork.imageUrl)}
        alt={artwork.title}
        onError={handleImageError}
      />

      {/* Title — always visible at bottom */}
      <div className="px-4 py-3">
        <h5 className="font-semibold tracking-tight text-heading leading-snug">
          {artwork.title}
        </h5>
        <p>{artwork.authors.map((author) => author.name).join(', ')}</p>
      </div>

      {/* Overlay — covers entire card on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-[var(--color-dark)] flex flex-col
          justify-center px-5 py-4 transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <h5 className="font-semibold tracking-tight text-heading leading-snug mb-3">
          {artwork.title}
        </h5>
        <div className="text-sm text-heading/80">
          {artwork.year ? artwork.year : 'n.d.'} <br />
          {artwork.authors.map((author) => author.name).join(', ')} <br />
          {artwork.buildings ? artwork.buildings.map((building) =>
            building.translated).join(', ') : ''} <br />
          {artwork.imageRights.copyright}
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
