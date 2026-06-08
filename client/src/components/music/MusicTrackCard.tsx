import type { TrackResult } from '../../../../shared/types/music';

interface MusicTrackCardProps {
  track: TrackResult;
  selected?: boolean;
  onSelect?: (track: TrackResult) => void;
}

const MusicTrackCard = ({ track, selected = false, onSelect }: MusicTrackCardProps) => {
  return (
    <div className='relative'>
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-stretch gap-3 rounded-2xl border border-white/15 bg-black/15
          p-3 transition hover:border-white/30 hover:bg-black/25"
      >
        <div className="h-15 w-15 shrink-0 overflow-hidden rounded-xl bg-white/10">
          {track.imageUrl ? (
            <img
              src={track.imageUrl}
              alt={track.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs uppercase
                tracking-[0.2em] text-white/40">
              Track
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3
                className="truncate text-sm font-semibold text-white transition
                  group-hover:text-white">
                {track.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-white/65">
                {track.artists.join(' · ')}
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.18em] text-white/45">
                {track.album}
              </p>
            </div>
          </div>
        </div>
      </a>

      {onSelect && (
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/70 px-2.5
            py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80
            backdrop-blur-sm transition hover:border-white/30 hover:bg-black/85"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSelect(track);
          }}
          aria-pressed={selected}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      )}
    </div>
  );
};

export default MusicTrackCard;
