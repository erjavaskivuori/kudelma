import { useGetPublicCardsQuery } from '../../services/api';
import PostcardCard from '../../components/postcard/PostcardCard';

const CommunityFeed = () => {
  const { data: publicCards, isLoading, isError } = useGetPublicCardsQuery();

  if (isLoading) {
    return <div>Loading community cards...</div>;
  }

  if (isError) {
    return <div>Error loading community cards. Please try again later.</div>;
  }

  return (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicCards?.map((card) => (
            <PostcardCard
              key={card.id}
              card={card}
            />
          ))}
        </div>
  );
};

export default CommunityFeed;
