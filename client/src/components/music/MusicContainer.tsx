import { useEffect, useState } from 'react';
import { useLazyGetMusicRecommendationsQuery } from '../../services/api';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { showModal } from '../../services/notifications/notificationSlice';
import { getSpotifyAuthUrl } from '../../services/user/userService';
import {
  DEFAULT_CUES,
  loadCues,
  storeCues,
} from '../../services/musicCueStorage';
import type { MusicCues } from '../../services/musicCueStorage';
import MusicCueEditor from './MusicCueEditor';

const TopMusicSection = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const [isConnecting, setIsConnecting] = useState(false);
  const [cues, setCues] = useState<MusicCues>(() =>
    currentUser ? loadCues(currentUser.id) : DEFAULT_CUES
  );
  const [isCueEditorVisible, setIsCueEditorVisible] = useState(() => {
    const saved = currentUser ? loadCues(currentUser.id) : DEFAULT_CUES;
    return !((saved.activity && saved.moods.length > 0) || saved.skipped);
  });
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = currentUser ? loadCues(currentUser.id) : DEFAULT_CUES;
    return saved.activity && saved.moods.length === 0 ? 2 : 1;
  });

  const [fetchRecommendations, { data: tracks, isLoading }] = useLazyGetMusicRecommendationsQuery();

  useEffect(() => {
    if (cues.updatedAt > 0 && currentUser) {
      storeCues(cues, currentUser.id);
    }
  }, [cues, currentUser]);

  // Fetch immediately on mount for returning users who already have complete cues
  useEffect(() => {
    if (currentUser?.spotifyConnected && !isCueEditorVisible) {
      void fetchRecommendations({ activity: cues.activity ?? '', moods: cues.moods });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moodLimitReached = cues.moods.length >= 2;
  const canProceed = currentStep === 1 ? Boolean(cues.activity) : cues.moods.length > 0;

  // --- Handlers ---

  const touchCues = (updates: Partial<MusicCues>) => {
    setCues((prev) => ({ ...prev, ...updates, updatedAt: Date.now() }));
  };

  const handleSkipCues = () => {
    setCues({ ...DEFAULT_CUES, skipped: true, updatedAt: Date.now() });
    setIsCueEditorVisible(false);
    if (currentUser?.spotifyConnected) {
      void fetchRecommendations({ activity: '', moods: [] });
    }
  };

  const handleApplyCues = () => {
    setIsCueEditorVisible(false);
    if (currentUser?.spotifyConnected) {
      void fetchRecommendations({ activity: cues.activity ?? '', moods: cues.moods });
    }
  };

  const handleActivitySelect = (label: string) => {
    if (cues.activity === label) {
      touchCues({ activity: null });
    } else {
      touchCues({ activity: label, skipped: false });
    }
  };

  const handleMoodToggle = (label: string) => {
    setCues((prev) => {
      const isSelected = prev.moods.includes(label);
      const nextMoods = isSelected
        ? prev.moods.filter((m) => m !== label)
        : prev.moods.length < 2
          ? [...prev.moods, label]
          : prev.moods;
      return { ...prev, moods: nextMoods, skipped: false, updatedAt: Date.now() };
    });
  };

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => Math.max(1, s - 1));

  // --- State: user not logged in ---
  if (!currentUser) {
    return (
      <div
        className="mb-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm
          text-center text-white">
        <h2 className="text-xl font-semibold">Soundtrack your moment</h2>
        <p className="mt-2 text-sm text-white/80">
          Create an account to connect Spotify and get personalized music
          recommendations based on the weather and time.
        </p>
      </div>
    );
  }

  // --- State: Spotify not connected ---
  if (!currentUser.spotifyConnected) {
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
      <div
        className="mb-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm
          text-center text-white">
        <h2 className="text-xl font-semibold">Link your Spotify</h2>
        <p className="mt-2 text-sm text-white/80 mb-4">
          Connect your Spotify account to see music perfectly tailored to your current environment.
        </p>
        <button
          onClick={() => { void handleConnectSpotify(); }}
          disabled={isConnecting}
          className="inline-block rounded-full bg-[#1DB954] px-6 py-2 text-sm font-semibold
            text-black transition hover:bg-[#1ed760] disabled:opacity-50
            disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Connect Spotify'}
        </button>
      </div>
    );
  }

  // --- State: cue editor ---
  if (isCueEditorVisible) {
    return (
      <MusicCueEditor
        currentStep={currentStep}
        cues={cues}
        moodLimitReached={moodLimitReached}
        canProceed={canProceed}
        onActivitySelect={handleActivitySelect}
        onMoodToggle={handleMoodToggle}
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleSkipCues}
        onApply={handleApplyCues}
      />
    );
  }

  // --- State: loading recommendations ---
  if (isLoading) {
    return (
      <div
        className="mb-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm
          flex justify-center items-center text-white min-h-37.5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return null;
  }
};

export default TopMusicSection;
