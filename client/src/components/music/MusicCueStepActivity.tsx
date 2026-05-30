import type { IconType } from 'react-icons';
import {
  FaBriefcase,
  FaBookOpen,
  FaWalking,
  FaCoffee,
  FaCar,
  FaBook,
  FaUtensils,
  FaDumbbell,
  FaUsers,
  FaMoon,
} from 'react-icons/fa';

const ACTIVITIES: { label: string; icon: IconType; tone: string }[] = [
  { label: 'Working', icon: FaBriefcase, tone: 'bg-sky-200/80 border-sky-200 text-slate-900' },
  {
    label: 'Studying', icon: FaBookOpen,
    tone: 'bg-emerald-200/80 border-emerald-200 text-slate-900'
  },
  { label: 'Walking', icon: FaWalking, tone: 'bg-amber-200/80 border-amber-200 text-slate-900' },
  { label: 'Relaxing', icon: FaCoffee, tone: 'bg-indigo-200/80 border-indigo-200 text-slate-900' },
  { label: 'Driving', icon: FaCar, tone: 'bg-rose-200/80 border-rose-200 text-slate-900' },
  { label: 'Reading', icon: FaBook, tone: 'bg-lime-200/80 border-lime-200 text-slate-900' },
  { label: 'Cooking', icon: FaUtensils, tone: 'bg-orange-200/80 border-orange-200 text-slate-900' },
  { label: 'Working out', icon: FaDumbbell, tone: 'bg-red-200/80 border-red-200 text-slate-900' },
  { label: 'Socializing', icon: FaUsers, tone: 'bg-pink-200/80 border-pink-200 text-slate-900' },
  { label: 'Wind down', icon: FaMoon, tone: 'bg-blue-200/80 border-blue-200 text-slate-900' },
];

type Props = {
  selected: string | null;
  onSelect: (label: string) => void;
};

const MusicCueStepActivity = ({ selected, onSelect }: Props) => (
  <div>
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <h3 className="text-sm font-semibold">What are you doing?</h3>
      <span className="text-xs text-white/50">Pick one</span>
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      {ACTIVITIES.map(({ label, icon: Icon, tone }) => {
        const isSelected = selected === label;
        const isDimmed = selected !== null && !isSelected;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(label)}
            aria-pressed={isSelected}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs
              font-semibold transition ${tone} ${
              isSelected ? 'ring-2 ring-white/70 shadow-sm' : 'hover:brightness-105'
            } ${isDimmed ? 'opacity-50' : ''}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default MusicCueStepActivity;
