import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useGetProfileCardsQuery } from '../../services/api';
import PostcardCard from '../../components/postcard/PostcardCard';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { showModal } from '../../services/notifications/notificationSlice';
import { refresh } from '../../services/user/userSlice';
import { getSpotifyAuthUrl } from '../../services/user/userService';

const ProfilePage = () => {
  const params = useParams();
  const userId = Number(params.userId);
  const currentUser = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const isConnected = searchParams.get('spotify_connected');
    const authError = searchParams.get('error');

    if (isConnected) {
      // 1. Show a success modal
      dispatch(showModal({
        title: 'Spotify Connected!',
        message: 'Your Spotify account has been successfully linked. \
          You can now get music recommendations.',
      }));

      // 2. Refresh the user state so currentUser.spotifyConnected becomes true
      void dispatch(refresh());

      // 3. Remove the query param from the URL
      searchParams.delete('spotify_connected');
      setSearchParams(searchParams, { replace: true });
    }

    if (authError) {
      dispatch(showModal({
        title: 'Connection Failed',
        message: 'There was an error connecting to Spotify. Please try again.',
      }));

      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, dispatch]);

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

  const isOwnProfile = currentUser?.id === userId;

  const handleConnectSpotify = async () => {
    try {
      setIsConnecting(true);
      const { url } = await getSpotifyAuthUrl();
      window.location.href = url;
    } catch {
      dispatch(showModal({
        title: 'Connection Failed',
        message: 'Could not fetch Spotify connection link. Please try again.',
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl text-white">
      <header className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/70">Profile</p>
            <h1 className="mt-1 text-3xl font-semibold">{data.profile.name}</h1>
          </div>
          {isOwnProfile && (
            <div className="text-right">
              {currentUser?.spotifyConnected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20
                  px-3 py-1 text-sm font-medium text-green-300 ring-1 ring-inset
                  ring-green-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  Spotify Connected
                </span>
              ) : (
                <button
                  onClick={() => { void handleConnectSpotify(); }}
                  disabled={isConnecting}
                  className={
                    "rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold " +
                    "text-black transition hover:bg-[#1ed760] disabled:opacity-50 " +
                    "disabled:cursor-not-allowed"
                  }
                >
                  {isConnecting ? 'Connecting...' : 'Connect Spotify'}
                </button>
              )}
            </div>
          )}
        </div>
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
