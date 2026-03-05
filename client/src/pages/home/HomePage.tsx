import { useState } from 'react';
import SuggestionsFeed from './SuggestionsFeed';
import CommunityFeed from './CommunityFeed';

type FeedMode = 'suggestions' | 'community';

const HomePage = () => {
  const [mode, setMode] = useState<FeedMode>('suggestions');

  return (
    <>
      <header
        className="flex items-center justify-center gap-4 mb-6
          text-[var(--color-extra-light)]">
        <button
          onClick={() => setMode('suggestions')}
          className={`${
              mode === 'suggestions'
                ? 'border-b-4 border-[var(--color-popup)]'
                : 'border-b-4 border-transparent'
            }`}
          >
          For you
        </button>
        <button
          onClick={() => setMode('community')}
          className={`${
              mode === 'community'
                ? 'border-b-4 border-[var(--color-popup)]'
                : 'border-b-4 border-transparent'
            }`}
        >
          Community
        </button>
      </header>

      {mode === 'suggestions' ? (
        <SuggestionsFeed />
      ) : (
        <CommunityFeed />
      )}
    </>
  );
};

export default HomePage;
