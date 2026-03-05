import type { Recipe } from "../../../../shared/types/recipe";
import { useAppDispatch } from "../../hooks/useAppStore";
import { setRecipe } from "../../services/card/favoriteSelectionSlice";
import FeedCard from "./FeedCard";

interface RecipeCardProps {
  recipe: Recipe;
  type: string;
}

const RecipeCard = ({ recipe, type }: RecipeCardProps) => {
  const dispatch = useAppDispatch();

  const handleFavoriteSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(setRecipe({
      id: recipe.id,
      title: recipe.title,
      sourceUrl: recipe.sourceUrl,
    }));
  };

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
    <FeedCard
      type={type}
      image={
        <>
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            <img
              className="rounded-t-2xl w-full"
              src={recipe.image}
              alt={recipe.title}
              onError={handleImageError}
            />
          </a>
        </>
      }
      title={
        <>
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            {recipe.title}
          </a>
        </>
      }
      details={
        <>
          Preparation: {recipe.readyInMinutes} min <br />
          Servings: {recipe.servings} <br />
          {specialDietLabels}
        </>
      }
      onFavoriteSelect={handleFavoriteSelection}
    />
  );
};

export default RecipeCard;
