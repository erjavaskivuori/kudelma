import { Link, useParams } from 'react-router';
import { useGetProfileCardsQuery } from '../../services/api';
import PostcardCard from '../../components/postcard/PostcardCard';

const ProfilePage = () => {
  const params = useParams();
  const userId = Number(params.userId);

  const {
    data,
    isLoading,
    isError,
  } = useGetProfileCardsQuery(userId, { skip: Number.isNaN(userId) });

  if (Number.isNaN(userId)) {
    return (
      <section
        className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-white/10
          p-6 text-white"
      >
        <h1 className="text-2xl font-semibold">Profile not found</h1>
        <p className="mt-2 text-sm text-white/80">Invalid profile id in URL.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section
        className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-white/10
          p-6 text-white"
      >
        <h1 className="text-2xl font-semibold">Loading profile</h1>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section
        className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-white/10
          p-6 text-white"
      >
        <h1 className="text-2xl font-semibold">Could not load profile</h1>
        <p className="mt-2 text-sm text-white/80">
          Please try again in a moment.
        </p>
      </section>
    );
  }

  const profileDate = new Date(data.profile.createdAt).toLocaleDateString("fi-FI");

  return (
    <section className="mx-auto max-w-6xl text-white">
      <header className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.15em] text-white/70">Profile</p>
        <h1 className="mt-1 text-3xl font-semibold">{data.profile.name}</h1>
        <p className="mt-2 text-sm text-white/80">Joined {profileDate}</p>
      </header>

      {!data.cardsVisible && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold">Cards are private</h2>
          <p className="mt-2 text-sm text-white/80">
            This user keeps their postcards private for now.
          </p>
          <p className="mt-3 text-sm text-white/80">
            <Link to="/" className="font-semibold text-white underline underline-offset-4">
              Explore inspiration feed
            </Link>
          </p>
        </div>
      )}

      {data.cardsVisible && data.cards.length === 0 && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold">No postcards yet</h2>
          <p className="mt-2 text-sm text-white/80">
            Nothing has been published on this profile so far.
          </p>
        </div>
      )}

      {data.cardsVisible && data.cards.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => (
            <PostcardCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
