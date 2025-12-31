import type { Item } from "../../../shared/types/feed";
import ArtCard from "./ArtCard";
import BookCard from "./BookCard";

interface FeedItemProps {
  item: Item;
}

const FeedItem = ({ item }: FeedItemProps) => {
  switch (item.type) {
    case "artwork":
      return <ArtCard artwork={item.data} />;
    case "book":
      return <BookCard book={item.data} />;
    default:
      return null;
  }
};

export default FeedItem;
