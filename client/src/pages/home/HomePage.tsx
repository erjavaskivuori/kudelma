import { useState } from 'react';
import SuggestionsFeed from './SuggestionsFeed';
import CommunityFeed from './CommunityFeed';

type FeedMode = 'suggestions' | 'community';

const HomePage = () => {
  const [mode, setMode] = useState<FeedMode>('suggestions');

  return (
    <>
      <header className="flex gap-4 mb-6">
        <button onClick={() => setMode('suggestions')}>
          For you
        </button>
        <button onClick={() => setMode('community')}>
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
