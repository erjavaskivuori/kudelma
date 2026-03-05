import FeedCard from "./FeedCard";
import type { Artwork } from "../../../../shared/types/art";
import { setArtwork, unsetArtwork } from "../../services/card/favoriteSelectionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";

interface ArtCardProps {
  artwork: Artwork;
  type: string;
}

const ArtCard = ({ artwork, type }: ArtCardProps) => {
  const dispatch = useAppDispatch();
  const selectedArtwork = useAppSelector(state => state.favoriteSelection.artwork);
  const isSelected = selectedArtwork?.id === artwork.id;

  const handleFavoriteSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSelected) {
      dispatch(unsetArtwork());
    } else {
      dispatch(setArtwork({
        id: artwork.id,
        title: artwork.title,
        year: artwork.year,
        imageUrl: artwork.imageUrl,
        authors: artwork.authors.map(author => author.name),
        buildings: artwork.buildings
          ? artwork.buildings.map(building => building.translated)
          : null,
        copyright: artwork.imageRights.copyright
      }));
    };
  };

  const getProxiedImageUrl = (originalImageUrl: string): string => {
    const fullImageUrl = `https://api.finna.fi${originalImageUrl}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullImageUrl)}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', artwork.title);
    e.currentTarget.style.display = 'none';
  };

  return (
    <FeedCard
      type={type}
      image={
      <img
        className="rounded-t-2xl w-full"
        src={getProxiedImageUrl(artwork.imageUrl)}
        alt={artwork.title}
        onError={handleImageError}
      />
      }
      title={artwork.title}
      details={artwork.authors.map((author) => author.name).join(', ')}
      overlayDetails={
        <>
          {artwork.year ? artwork.year : 'n.d.'} <br />
          {artwork.authors.map((author) => author.name).join(', ')} <br />
          {artwork.buildings ? artwork.buildings.map((building) =>
            building.translated).join(', ') : ''} <br />
          {artwork.imageRights.copyright}
        </>
      }
      onFavoriteSelect={handleFavoriteSelection}
    />
  );
};

export default ArtCard;
