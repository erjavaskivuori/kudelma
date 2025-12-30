import FeedItem from "./FeedItem";
import type { Item } from "./FeedItem";

interface MasonryProps {
  items: Item[];
}

const Masonry = ({ items }: MasonryProps) => {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
      {items.map((item) => (
        <div key={item.data.id} className="break-inside-avoid mb-4">
          <FeedItem item={item} />
        </div>
      ))}
    </div>
  );
};

export default Masonry;