import type { Artwork } from "../../../shared/types/art";
import ArtCard from "./ArtCard";

export interface Item {
  type: string;
  data: Artwork;
}

interface FeedItemProps {
  item: Item;
}

const FeedItem = ({ item }: FeedItemProps) => {
  switch (item.type) {
    case "artwork":
      return <ArtCard artwork={item.data} />;
    default:
      return null;
  }
};

export default FeedItem;