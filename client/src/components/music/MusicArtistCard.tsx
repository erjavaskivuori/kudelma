import type { ArtistResult } from '../../../../shared/types/music';

interface MusicArtistCardProps {
  artist: ArtistResult;
  selected?: boolean;
  onSelect?: (artist: ArtistResult) => void;
}

const MusicArtistCard = ({ artist, selected = false, onSelect }: MusicArtistCardProps) => {
  return (
    <div className='relative'>
      <a
        href={artist.spotifyUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex w-24 shrink-0 flex-col items-center rounded-2xl border
          border-white/15 bg-black/15 p-3 text-center transition
          hover:border-white/30 hover:bg-black/25 sm:w-28"
      >
        <div className="h-16 w-16 overflow-hidden rounded-full bg-white/10 sm:h-20 sm:w-20">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[10px] uppercase
                tracking-[0.2em] text-white/40">
              Artist
            </div>
          )}
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white transition group-hover:text-white">
          {artist.name}
        </h3>
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
            onSelect(artist);
          }}
          aria-pressed={selected}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      )}
    </div>
  );
};

export default MusicArtistCard;
