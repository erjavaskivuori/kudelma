import { useAppSelector } from '../../hooks/useAppStore';
import ArtCard from './ArtCard';
import BookCard from './BookCard';
import RecipeCard from './RecipeCard';

const Selection = () => {
  const { book, artwork, recipe } = useAppSelector(
    state => state.favoriteSelection
  );

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
  ].filter(Boolean);

  return (
    <div className="flex items-end gap-4 p-4">
      {/* Stack selected cards */}
      {selectedCards.length > 0 && (
        <div className="relative flex items-end h-32">
          {selectedCards.map((card, index) => (
            <div
              key={card?.type}
              className={`
                ${card?.rotation}
                transition-transform duration-300 ease-in-out
                ${index > 0 ? '-ml-10' : ''}
                z-${index}
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
            type="button"
            className="mt-2 px-4 py-1.5 rounded-xl text-sm font-semibold
              bg-[var(--color-popup)] text-white
              hover:bg-[var(--color-extra-dark)]
              transition-colors duration-200"
          >
            Create card
          </button>
        )}
      </div>
    </div>
  );
};

export default Selection;
