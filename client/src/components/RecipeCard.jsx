import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { apiRequest } from "../utils/api.js";
import { applyRecipeImageFallback, getRecipeFallbackImage } from "../utils/imageFallbacks.js";
import { getMockChefName } from "../utils/mockChefs.js";

const RecipeCard = ({ recipe, onBookmarkToggle, showBadge = true }) => {
  const { user, token, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const isExternal = Boolean(recipe.isExternal);
  const chefName = recipe.createdBy?.name || (isExternal ? getMockChefName(recipe._id || recipe.title) : "Savora Chef");
  const description =
    recipe.summary ||
    (isExternal ? `Signature dish from Chef ${chefName}.` : "A community favourite loved by Savora cooks.");

  const cuisineLabel = recipe.cuisineType || recipe.cuisine || recipe.category || "Savora";
  const timeLabel = recipe.cookingTime ? `${recipe.cookingTime} mins` : cuisineLabel;
  const ratingLabel =
    typeof recipe.avgRating === "number" ? recipe.avgRating.toFixed(1) : isExternal ? "–" : "0.0";
  const authorLabel = chefName;

  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      addToast("Login to save favorites", "warning");
      return;
    }

    try {
      const response = await apiRequest(`/recipes/${recipe._id}/bookmark`, {
        method: "POST",
        token,
      });
      await refreshProfile();
      onBookmarkToggle?.(recipe._id, response.bookmarksCount);
      addToast(response.message, "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const imageSrc =
    recipe.imageUrl ||
    getRecipeFallbackImage({ cuisine: recipe.cuisineType || recipe.cuisine, category: recipe.category, title: recipe.title });

  return (
    <Link to={`/recipes/${recipe._id}`} className="recipe-card">
      <div className="recipe-card__image-wrapper">
        <img
          src={imageSrc}
          alt={recipe.title}
          loading="lazy"
          onError={(event) =>
            applyRecipeImageFallback(event, {
              cuisine: recipe.cuisineType || recipe.cuisine,
              category: recipe.category,
              title: recipe.title,
            })
          }
        />
        {showBadge && <span className="recipe-card__badge">{cuisineLabel}</span>}
      </div>
      <div className="recipe-card__content">
        <h3>{recipe.title}</h3>
        <p>{description}</p>
        <div className="recipe-card__meta">
          <span>{timeLabel}</span>
          <span className="recipe-card__rating">★ {ratingLabel}</span>
        </div>
        <div className="recipe-card__actions">
          <span className="recipe-card__author">{authorLabel}</span>
          {!isExternal && (
            <button type="button" className="recipe-card__bookmark" onClick={handleBookmark}>
              <span aria-hidden>♡</span>
              <span className="sr-only">Bookmark recipe</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    cuisineType: PropTypes.string,
    summary: PropTypes.string,
    cookingTime: PropTypes.number,
    avgRating: PropTypes.number,
    createdBy: PropTypes.shape({
      name: PropTypes.string,
    }),
    isExternal: PropTypes.bool,
    cuisine: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  onBookmarkToggle: PropTypes.func,
  showBadge: PropTypes.bool,
};

export default RecipeCard;
