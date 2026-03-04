import type { Item } from "../../../../shared/types/feed";
import ArtCard from "./ArtCard";
import BookCard from "./BookCard";
import RecipeCard from "./RecipeCard";

interface FeedItemProps {
  item: Item;
}

const FeedItem = ({ item }: FeedItemProps) => {
  switch (item.type) {
    case "artwork":
      return <ArtCard type={item.type} artwork={item.data} />;
    case "book":
      return <BookCard type={item.type} book={item.data} />;
    case "recipe":
      return <RecipeCard type={item.type} recipe={item.data} />;
    default:
      return null;
  }
};

export default FeedItem;
