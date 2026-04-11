import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import SuggestionsFeed from './SuggestionsFeed';
import CommunityFeed from './CommunityFeed';

type FeedMode = 'suggestions' | 'community';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'community' ? 'community' : 'suggestions';
  const [mode, setMode] = useState<FeedMode>(initialMode);

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode && urlMode !== mode && (urlMode === 'community' || urlMode === 'suggestions')) {
      setMode(urlMode as FeedMode);
    }
  }, [searchParams, mode]);

  const handleModeChange = (newMode: FeedMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  return (
    <>
      <header
        className="flex items-center justify-center gap-4 mb-6
          text-[var(--color-extra-light)]">
        <button
          onClick={() => handleModeChange('suggestions')}
          className={`${
              mode === 'suggestions'
                ? 'border-b-4 border-[var(--color-popup)]'
                : 'border-b-4 border-transparent'
            }`}
          >
          For you
        </button>
        <button
          onClick={() => handleModeChange('community')}
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
