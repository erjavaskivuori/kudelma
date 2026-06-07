import type { PlaylistResult } from '../../../../shared/types/music';

interface MusicPlaylistCardProps {
  playlist: PlaylistResult;
}

const MusicPlaylistCard = ({ playlist }: MusicPlaylistCardProps) => {
  return (
    <a
      href={playlist.spotifyUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex items-stretch gap-3 rounded-2xl border border-white/15 bg-black/15
        p-3 transition hover:border-white/30 hover:bg-black/25"
    >
      <div className="h-15 w-15 shrink-0 overflow-hidden rounded-xl bg-white/10">
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-xs uppercase
              tracking-[0.2em] text-white/40">
            Playlist
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate text-sm font-semibold text-white transition
                group-hover:text-white">
              {playlist.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/65">
              {playlist.description || 'Spotify playlist'}
            </p>
          </div>
          <span
            className="rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold
              uppercase tracking-[0.18em] text-white/50">
            Playlist
          </span>
        </div>
      </div>
    </a>
  );
};

export default MusicPlaylistCard;
