import { useState } from 'react';
import { LuChefHat } from "react-icons/lu";
import { PiBooksFill, PiMusicNotesFill } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import { removeCard } from '../../services/card/cardService';
import { showModal } from '../../services/notifications/notificationSlice';
import type { PostCard } from '../../../../shared/types/card';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';

const formatDate = (dateIso: string) => {
  const date = new Date(dateIso);
  return date.toLocaleDateString("fi-FI");
};

const PostcardCard = ({ card }: { card: PostCard }) => {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const hasPlaylist = card.playlist !== undefined;
  const hasTrack = card.track !== undefined;
  const hasArtist = card.artist !== undefined;

  const handleRemoveCard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (window.confirm(
        'Are you sure you want to remove this postcard? This action cannot be undone.'
      )) {
        await removeCard(card.id);
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(showModal({
          title: 'Failed to remove postcard',
          message: `An error occurred while trying to remove the postcard:
            ${error.message}. Please try again.`,
        }));
      } else {
        dispatch(showModal({
          title: 'Failed to remove postcard',
          message: 'An unknown error occurred while trying to remove the postcard.\
            Please try again.',
        }));
      }
    }
  };

  return (
    <article className="group perspective-distant">
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={
          flipped ? 'Show postcard front' : 'Show postcard back'
        }
      >
        <div
          className="relative h-87 w-full rounded-2xl shadow-lg
            transition-transform duration-500
            transform-3d group-focus-within:shadow-xl"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border
              border-white/40 bg-(--color-light)
              backface-hidden"
          >
            <img
              src={card.artwork.imageUrl}
              alt={card.artwork.title}
              className="h-56 w-full object-cover"
            />
            <div
              className="flex h-[calc(100%-14rem)] flex-col justify-between p-4
                text-slate-800"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Postcard from&nbsp;
                  <a href={`/profile/${card.user?.id}`} className="hover:underline">
                    {card.user?.name}
                  </a>
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">{card.artwork.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {card.artwork.authors.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-2xl border border-white/30
              bg-yellow-50 p-4 text-slate-800 backface-hidden transform-[rotateY(180deg)]"
          >
            {currentUser?.id === card.user?.id && (
              <button
                type="button"
                className="absolute bottom-4 left-4 z-10 rounded-full p-1.5 text-red-500 transition
                  hover:bg-red-50 hover:text-red-600"
                onClick={(e) => void handleRemoveCard(e)}
                aria-label="Remove this postcard"
              >
                <BsTrash3 size={22} />
              </button>
            )}
            <div className="grid h-full grid-cols-[1fr_7rem] gap-4">
              <div className="flex flex-col">
                <div
                  className="text-xl leading-none tracking-wide"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  Greetings from {card.postcardMeta?.city ?? 'somewhere'}!
                </div>
                <p className="mt-4 text-sm text-slate-700">
                  My picks:
                </p>
                <div className="flex gap-2 mt-2">
                  <LuChefHat className="shrink-0 text-md" />
                  <a
                    href={card.recipe.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    <h4 className="text-sm font-semibold leading-4">{card.recipe.title}</h4>
                  </a>
                </div>

                <div className="flex gap-2 mt-2">
                  <PiBooksFill className="mt-1 shrink-0 text-md" />
                  <div>
                    <a
                    href={`https://openlibrary.org${card.book.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline">
                      <p className="text-sm font-semibold">{card.book.title}</p>
                    </a>
                    <p className="text-xs text-slate-600">{card.book.authors.join(', ')}</p>
                  </div>
                </div>
                {(hasPlaylist || hasTrack || hasArtist) && (
                  <div className="flex gap-2 mt-2">
                    <PiMusicNotesFill className="mt-1.5 shrink-0 text-md" />
                    <div>
                        {hasArtist && (
                            <a
                            href={card.artist?.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline">
                              <p className="text-sm font-semibold">{card.artist?.name}</p>
                            </a>
                        )}
                        {hasTrack && (
                            <a
                            href={card.track?.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline">
                              <p className="text-sm font-semibold">
                                {card.track?.title} by&nbsp;
                                {card.track?.artists?.map((a) => a).join(', ')}
                              </p>
                            </a>
                        )}
                        {hasPlaylist && (
                          <a
                            href={card.playlist?.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline">
                            <p className="text-sm font-semibold">{card.playlist?.title}</p>
                          </a>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <img
                  src={card.artwork.imageUrl}
                  alt="Artwork stamp"
                  className="h-20 w-16 rounded-sm border border-slate-300 object-cover p-1"
                />
                <div className="text-right text-xs text-slate-600">
                  <p>{formatDate(card.postcardMeta.createdAt)}</p>
                  <p>{card.postcardMeta.weatherMain ?? 'Weather unknown'}</p>
                  {card.postcardMeta.temperatureCelsius !== null && (
                    <p>{card.postcardMeta.temperatureCelsius}&#8451;</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
};

export default PostcardCard;
