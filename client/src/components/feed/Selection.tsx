import { useNavigate, useLocation } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import ArtCard from './ArtCard';
import BookCard from './BookCard';
import RecipeCard from './RecipeCard';
import { createCardAsync } from '../../services/card/favoriteSelectionSlice';
import { showModal } from '../../services/notifications/notificationSlice';
import type { WeatherData } from '../../../../shared/types/weather';
import {
  getSelectedMusicImageUrl,
  getSelectedMusicLabel
} from '../../services/card/musicSelection';

type SelectionProps = {
  weather?: WeatherData;
};

const Selection = ({ weather }: SelectionProps) => {
  const { status, error, book, artwork, recipe } = useAppSelector(
    state => state.favoriteSelection
  );
  const selectedMusic = useAppSelector((state) => state.favoriteSelection.selectedMusic);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const allSelected = book && artwork && recipe;
  const noneSelected = !book && !artwork && !recipe;

  const missingCategories: string[] = [];
  if (!book) missingCategories.push('book');
  if (!artwork) missingCategories.push('artwork');
  if (!recipe) missingCategories.push('recipe');

  const guideText = noneSelected
    ? 'Select one book, one artwork, and one recipe to create your card!'
    : allSelected
      ? 'All items selected! Create your card now.'
      : `Choose ${missingCategories.join(' and ')} to finish your card!`;

  const selectedCards = [
    artwork && { type: 'artwork' as const, data: artwork, rotation: '-rotate-6' },
    book && { type: 'book' as const, data: book, rotation: 'rotate-0' },
    recipe && { type: 'recipe' as const, data: recipe, rotation: 'rotate-6' },
    selectedMusic && { type: 'music' as const, data: selectedMusic, rotation: 'rotate-10' },
  ].filter(Boolean);

  const handleCreateCard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      const redirect = `${location.pathname}${location.search}`;
      dispatch(showModal({
        title: 'Login required',
        message: 'You need to log in or create an account before creating a card.',
        primaryAction: {
          label: 'Login',
          to: `/login?redirect=${encodeURIComponent(redirect)}`,
        },
        secondaryAction: {
          label: 'Register',
          to: `/register?redirect=${encodeURIComponent(redirect)}`,
        },
      }));
      return;
    }

    if (allSelected) {
      try {
        await dispatch(createCardAsync({
          book: book,
          artwork: artwork,
          recipe: recipe,
          selectedMusic,
          postcardMeta: {
            city: weather?.city,
            weatherMain: weather?.main,
            temperatureCelsius: weather?.temperature,
          },
        })).unwrap();
        void navigate(`/profile/${user.id}`);
      } catch {
        dispatch(showModal({
          title: 'Could not create a card',
          message: error || 'Unknown error occurred.',
        }));
      }
    }
  };

  return (
    <div className="flex items-end gap-4 p-4">
      {/* Stack selected cards */}
      {selectedCards.length > 0 && (
        <div className="relative flex items-end h-32">
          {selectedCards.map((card, index) => (
            <div
              key={card?.type}
              style={{ zIndex: index + 1 }}
              className={`
                ${card?.rotation}
                transition-transform duration-300 ease-in-out
                ${index > 0 ? '-ml-10' : ''}
                w-35
                text-xs
              `}
            >
              <div className="transform origin-bottom-left">
                {card?.type === 'artwork' && (
                  <ArtCard artwork={card.data}/>
                )}
                {card?.type === 'book' && (
                  <BookCard book={card.data} />
                )}
                {card?.type === 'recipe' && (
                  <RecipeCard recipe={card.data} />
                )}
                {card?.type === 'music' && (
                  <div
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl
                    shadow-lg">
                    <img
                      src={getSelectedMusicImageUrl(card.data)}
                      alt={getSelectedMusicLabel(card.data)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guide bubble */}
      <div
        className={`
          px-5 py-3 rounded-2xl text-sm shadow-lg
          backdrop-blur-md bg-white/70 text-gray-800
          border border-white/40
          transition-all duration-300
          ${allSelected ? 'bg-green-100/70 border-green-300/50' : ''}
        `}
      >
        <p>{guideText}</p>
        {allSelected && (
          <button
            disabled={status === 'loading'}
            type="button"
            className="mt-2 px-4 py-1.5 rounded-xl text-sm font-semibold
              bg-(--color-dark) text-white
              hover:bg-(--color-extra-dark)
              transition-colors duration-200"
            onClick={(e) => void handleCreateCard(e)}
          >
            Create card
          </button>
        )}
      </div>
    </div>
  );
};

export default Selection;
