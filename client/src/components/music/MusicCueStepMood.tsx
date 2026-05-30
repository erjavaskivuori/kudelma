import type { IconType } from 'react-icons';
import {
  FaCoffee,
  FaBullseye,
  FaSmile,
  FaDove,
  FaCloudRain,
  FaBolt,
  FaCloud,
  FaHistory,
  FaHeart,
  FaCouch,
} from 'react-icons/fa';

const MOODS: { label: string; icon: IconType; tone: string }[] = [
  { label: 'Chill', icon: FaCoffee, tone: 'bg-sky-200/80 border-sky-200 text-slate-900' },
  { label: 'Focus', icon: FaBullseye, tone: 'bg-emerald-200/80 border-emerald-200 text-slate-900' },
  { label: 'Happy', icon: FaSmile, tone: 'bg-yellow-200/80 border-yellow-200 text-slate-900' },
  { label: 'Calm', icon: FaDove, tone: 'bg-teal-200/80 border-teal-200 text-slate-900' },
  {
    label: 'Melancholic', icon: FaCloudRain,
    tone: 'bg-slate-200/80 border-slate-200 text-slate-900'
  },
  { label: 'Energetic', icon: FaBolt, tone: 'bg-orange-200/80 border-orange-200 text-slate-900' },
  { label: 'Dreamy', icon: FaCloud, tone: 'bg-purple-200/80 border-purple-200 text-slate-900' },
  { label: 'Nostalgic', icon: FaHistory, tone: 'bg-amber-200/80 border-amber-200 text-slate-900' },
  { label: 'Romantic', icon: FaHeart, tone: 'bg-rose-200/80 border-rose-200 text-slate-900' },
  { label: 'Cozy', icon: FaCouch, tone: 'bg-indigo-200/80 border-indigo-200 text-slate-900' },
];

type Props = {
  selected: string[];
  limitReached: boolean;
  onToggle: (label: string) => void;
};

const MusicCueStepMood = ({ selected, limitReached, onToggle }: Props) => (
  <div>
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <h3 className="text-sm font-semibold">What is the mood?</h3>
      <span className="text-xs text-white/50">Pick up to two</span>
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      {MOODS.map(({ label, icon: Icon, tone }) => {
        const isSelected = selected.includes(label);
        const isDisabled = limitReached && !isSelected;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(label)}
            aria-pressed={isSelected}
            disabled={isDisabled}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs
              font-semibold transition ${tone} ${
              isSelected ? 'ring-2 ring-white/70 shadow-sm' : 'hover:brightness-105'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default MusicCueStepMood;
