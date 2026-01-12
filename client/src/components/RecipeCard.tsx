import type { Recipe } from "../../../shared/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image for:', recipe.title);
    e.currentTarget.style.display = 'none';
  };

  const specialDietLabels = [
    recipe.vegetarian ? 'Vegetarian' : '',
    recipe.vegan ? 'Vegan' : '',
    recipe.glutenFree ? 'Gluten Free' : '',
    recipe.dairyFree ? 'Dairy Free' : ''
  ].filter(label => label !== '').join(', ');

  return (
    <div className="bg-[var(--color-dark)] block max-w-sm rounded-2xl shadow-xs">
      <img
        className="rounded-t-2xl w-full"
        src={recipe.image}
        alt={recipe.title}
        onError={handleImageError}
      />
      <div className="p-6">
        <h5 className="mt-1 mb-1 font-semibold tracking-tight text-heading">
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            {recipe.title}
          </a>
        </h5>
        <p>
          Preparation: {recipe.readyInMinutes} min <br />
          Servings: {recipe.servings} <br />
          {specialDietLabels}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
