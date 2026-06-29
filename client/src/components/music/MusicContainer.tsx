import { useEffect, useState } from 'react';
import { useGetWeatherQuery, useLazyGetMusicRecommendationsQuery } from '../../services/api';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { showModal } from '../../services/notifications/notificationSlice';
import { getSpotifyAuthUrl } from '../../services/user/userService';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import {
  DEFAULT_CUES,
  loadCues,
  storeCues,
} from '../../services/musicCueStorage';
import type { MusicCues } from '../../services/musicCueStorage';
import MusicCueEditor from './MusicCueEditor';
import MusicRecommendations from './MusicRecommendtions';
import MusicPlaylistCard from './MusicPlaylistCard';
import MusicTrackCard from './MusicTrackCard';
import MusicArtistCard from './MusicArtistCard';
import { clearSelectedMusic, setSelectedMusic } from '../../services/card/favoriteSelectionSlice';
import type { SelectedMusic } from '../../services/card/musicSelection';

interface RecommendationRequest {
  activity: string;
  moods: string[];
}

const TopMusicSection = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const selectedMusic = useAppSelector((state) => state.favoriteSelection.selectedMusic);
  const [isConnecting, setIsConnecting] = useState(false);
  const { coords } = useGeoLocation();
  const { data: weather, isLoading: isWeatherLoading } = useGetWeatherQuery(
    coords ?? { lat: 0, lon: 0 },
    { skip: !coords }
  );
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
  const [pendingRecommendationRequest, setPendingRecommendationRequest] =
    useState<RecommendationRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'playlists' | 'tracks' | 'artists'>('playlists');

  const [
    fetchRecommendations,
    { data: recommendations, isLoading }
  ] = useLazyGetMusicRecommendationsQuery();

  useEffect(() => {
    if (!pendingRecommendationRequest || !weather) {
      return;
    }

    void fetchRecommendations({
      ...pendingRecommendationRequest,
      weatherData: weather,
    });
    setPendingRecommendationRequest(null);
  }, [fetchRecommendations, pendingRecommendationRequest, weather]);

  useEffect(() => {
    if (cues.updatedAt > 0 && currentUser) {
      storeCues(cues, currentUser.id);
    }
  }, [cues, currentUser]);

  // Fetch immediately on mount for returning users who already have complete cues
  useEffect(() => {
    if (currentUser?.spotifyConnected && !isCueEditorVisible) {
      setPendingRecommendationRequest({ activity: cues.activity ?? '', moods: cues.moods });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCueComplete = Boolean(cues.activity && cues.moods.length > 0);
  const moodLimitReached = cues.moods.length >= 2;
  const canProceed = currentStep === 1 ? Boolean(cues.activity) : cues.moods.length > 0;

  // --- Handlers ---

  const touchCues = (updates: Partial<MusicCues>) => {
    setCues((prev) => ({ ...prev, ...updates, updatedAt: Date.now() }));
  };
  const requestRecommendations = (request: RecommendationRequest) => {
    if (weather) {
      void fetchRecommendations({ ...request, weatherData: weather });
      return;
    }

    setPendingRecommendationRequest(request);
  };

  const handleSkipCues = () => {
    setCues({ ...DEFAULT_CUES, skipped: true, updatedAt: Date.now() });
    setIsCueEditorVisible(false);
    if (currentUser?.spotifyConnected) {
      requestRecommendations({ activity: '', moods: [] });
    }
  };

  const handleApplyCues = () => {
    setIsCueEditorVisible(false);
    if (currentUser?.spotifyConnected) {
      requestRecommendations({ activity: cues.activity ?? '', moods: cues.moods });
    }
  };

  const isSelected = (candidate: SelectedMusic): boolean => {
    if (!selectedMusic) {
      return false;
    }

    switch (selectedMusic.kind) {
      case 'playlist':
        return candidate.kind === 'playlist' && selectedMusic.playlist.id === candidate.playlist.id;
      case 'track':
        return candidate.kind === 'track' && selectedMusic.track.id === candidate.track.id;
      case 'artist':
        return candidate.kind === 'artist' && selectedMusic.artist.id === candidate.artist.id;
    }
  };

  const toggleMusicSelection = (candidate: SelectedMusic) => {
    if (isSelected(candidate)) {
      dispatch(clearSelectedMusic());
      return;
    }

    dispatch(setSelectedMusic(candidate));
  };
  if (pendingRecommendationRequest && isWeatherLoading) {
    return (
      <div
        className="mb-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm
          flex justify-center items-center text-white min-h-37.5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

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

  const openCueEditor = () => {
    setIsCueEditorVisible(true);
    setCurrentStep(1);
  };

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

  if (!recommendations) {
    return null;
  }

  // --- State: recommendations ready ---
  const hasPlaylists = recommendations.playlists.length > 0;
  const hasTracks = recommendations.tracks.length > 0;
  const hasArtists = recommendations.artists.length > 0;

  return (
    <div
      className="mb-8 mx-2 max-h-90 rounded-2xl border border-white/20 bg-white/10 p-3 pl-5
      text-white backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Soundtrack your moment</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
          <button
            type="button"
            onClick={openCueEditor}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold
              uppercase tracking-wide text-white/70 transition hover:text-white"
          >
            {isCueComplete ? 'Change cues' : 'Add cues'}
          </button>
        </div>
      </div>
      {/* Tab toggle — visible only on small screens */}
      <div className="flex gap-2 mb-3 lg:hidden">
        {(['playlists', 'tracks', 'artists'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition
              ${activeTab === tab
                ? 'border-white/30 bg-white/20 text-white'
                : 'border-white/15 text-white/55 hover:text-white/80'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3 pr-2">
        <div className={activeTab !== 'playlists' ? 'hidden lg:block' : ''}>
          <MusicRecommendations
            title="Playlists"
            emptyMessage="No playlists matched this set of cues."
            content={
              hasPlaylists ? (
                <div
                  className="max-h-30 md:max-h-40 max-w-70 sm:max-w-full space-y-2 overflow-y-auto
                    pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                  {recommendations.playlists.map((playlist) => (
                    <MusicPlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      selected={isSelected({ kind: 'playlist', playlist })}
                      onSelect={(item) => toggleMusicSelection({
                        kind: 'playlist',
                        playlist: item
                      })}
                    />
                  ))}
                </div>
              ) : null
            }
          />
        </div>

        <div className={activeTab !== 'tracks' ? 'hidden lg:block' : ''}>
          <MusicRecommendations
            title="Tracks"
            emptyMessage="No tracks matched this set of cues."
            content={
              hasTracks ? (
                <div
                  className="max-h-30 md:max-h-40 max-w-70 sm:max-w-full space-y-2 overflow-y-auto
                    pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                  {recommendations.tracks.map((track) => (
                    <MusicTrackCard
                      key={track.id}
                      track={track}
                      selected={isSelected({ kind: 'track', track })}
                      onSelect={(item) => toggleMusicSelection({ kind: 'track', track: item })}
                    />
                  ))}
                </div>
              ) : null
            }
          />
        </div>

        <div className={activeTab !== 'artists' ? 'hidden lg:block' : ''}>
          <MusicRecommendations
            title="Artists"
            emptyMessage="No artists matched this set of cues."
            content={
              hasArtists ? (
                <div
                  className="max-h-30 md:max-h-40 max-w-70 sm:max-w-full flex flex-nowrap gap-2
                    overflow-x-auto overflow-y-hidden pr-1 scrollbar-thin
                    scrollbar-track-transparent scrollbar-thumb-white/20">
                  {recommendations.artists.map((artist) => (
                    <MusicArtistCard
                      key={artist.id}
                      artist={artist}
                      selected={isSelected({ kind: 'artist', artist })}
                      onSelect={(item) => toggleMusicSelection({ kind: 'artist', artist: item })}
                    />
                  ))}
                </div>
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TopMusicSection;
