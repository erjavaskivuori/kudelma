import type { Recipe } from "../../../../shared/types/recipe";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";
import { setRecipe, unsetRecipe } from "../../services/card/favoriteSelectionSlice";
import FeedCard from "./FeedCard";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  const selectedRecipe = useAppSelector(state => state.favoriteSelection.recipe);
  const isSelected = selectedRecipe?.id === recipe.id;

  const handleFavoriteSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSelected) {
          dispatch(unsetRecipe());
        } else {
          dispatch(setRecipe(recipe));
        }
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
      selected={isSelected}
    />
  );
};

export default RecipeCard;
