import type { MusicCues } from '../../services/musicCueStorage';
import MusicCueStepActivity from './MusicCueStepActivity';
import MusicCueStepMood from './MusicCueStepMood';

type Props = {
  currentStep: number;
  cues: MusicCues;
  moodLimitReached: boolean;
  canProceed: boolean;
  onActivitySelect: (label: string) => void;
  onMoodToggle: (label: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onApply: () => void;
};

const MusicCueEditor = ({
  currentStep,
  cues,
  moodLimitReached,
  canProceed,
  onActivitySelect,
  onMoodToggle,
  onNext,
  onBack,
  onSkip,
  onApply,
}: Props) => (
  <div
    className="mb-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm
     text-white mx-2">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Soundtrack your moment</h2>
        <span className="text-xs text-white/50 uppercase tracking-wide">Step {currentStep}/2</span>
      </div>

      {currentStep === 1 && (
        <MusicCueStepActivity
          selected={cues.activity}
          onSelect={onActivitySelect}
        />
      )}
      {currentStep === 2 && (
        <MusicCueStepMood
          selected={cues.moods}
          limitReached={moodLimitReached}
          onToggle={onMoodToggle}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold
                uppercase tracking-wide text-white/70 transition hover:text-white"
            >
              Back
            </button>
          )}
          {currentStep === 1 && (
            <button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold
                uppercase tracking-wide text-white/70 transition hover:text-white
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold
              uppercase tracking-wide text-white/70 transition hover:text-white"
          >
            Skip for now
          </button>
        </div>
        {currentStep === 2 && (
          <button
            type="button"
            onClick={onApply}
            disabled={!canProceed}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase
              tracking-wide text-black transition hover:bg-white/90 disabled:cursor-not-allowed
              disabled:opacity-50"
          >
            See recommendations
          </button>
        )}
      </div>
    </div>
  </div>
);

export default MusicCueEditor;
