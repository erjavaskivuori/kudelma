import type { Artwork } from "../../../shared/types/art";

interface ArtCardProps {
  artwork: Artwork;
}

const ArtCard = ({ artwork }: ArtCardProps) => {
  const getProxiedImageUrl = (originalImageUrl: string): string => {
    const fullImageUrl = `https://api.finna.fi${originalImageUrl}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullImageUrl)}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', artwork.title);
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs">
      <img 
        className="rounded-t-2xl w-full" 
        src={getProxiedImageUrl(artwork.imageUrl)} 
        alt={artwork.title}
        onError={handleImageError}
        loading="lazy"
      />
      <div className="p-6">
        <h5 className="mt-1 mb-1 font-semibold tracking-tight text-heading">
          {artwork.title} <br />
          {artwork.year ? artwork.year : 'n.d.'} <br />
          {artwork.authors.map((author) => author.name).join(', ')} <br />
          {artwork.buildings ? artwork.buildings.map((building) =>
            building.translated).join(', ') : ''}
        </h5>
      </div>
    </div>
  );
};

export default ArtCard;
