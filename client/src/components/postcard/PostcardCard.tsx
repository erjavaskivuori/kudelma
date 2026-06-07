import { useState } from 'react';
import { LuChefHat } from "react-icons/lu";
import { PiBooksFill } from "react-icons/pi";
import type { PostCard } from '../../../../shared/types/card';

type PostcardCardProps = {
  card: PostCard;
};

const formatDate = (dateIso: string) => {
  const date = new Date(dateIso);
  return date.toLocaleDateString("fi-FI");
};

const PostcardCard = ({ card }: PostcardCardProps) => {
  const [flipped, setFlipped] = useState(false);

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
          className="relative h-84 w-full rounded-2xl shadow-lg
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
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Postcard</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">{card.artwork.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {card.artwork.authors.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-2xl border border-white/30
              bg-yellow-50 p-4
              text-slate-800 backface-hidden transform-[rotateY(180deg)]"
          >
            <div className="grid h-full grid-cols-[1fr_7rem] gap-4">
              <div className="flex flex-col">
                <div
                  className="text-[1.7rem] leading-none tracking-wide"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  Greetings from {card.postcardMeta?.city ?? 'somewhere'}!
                </div>
                <p className="mt-4 text-sm text-slate-700">
                  My picks:
                </p>
                <div className="flex gap-2 mt-2">
                  <LuChefHat className="mt-1 shrink-0 text-lg" />
                  <a
                    href={card.recipe.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    <h4 className="text-base font-semibold">{card.recipe.title}</h4>
                  </a>
                </div>

                <div className="flex gap-2">
                  <PiBooksFill className="mt-1 shrink-0 text-lg" />
                  <div>
                    <a href={`https://openlibrary.org${card.book.id}`} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">
                      <p className="text-base font-semibold">{card.book.title}</p>
                    </a>
                    <p className="text-sm text-slate-600">{card.book.authors.join(', ')}</p>
                  </div>
                </div>
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
                    <p>{card.postcardMeta.temperatureCelsius} C</p>
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
