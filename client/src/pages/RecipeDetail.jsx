import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/RatingStars.jsx";
import { apiRequest } from "../utils/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { getExternalRecipeById } from "../api/externalRecipes.js";
import { applyRecipeImageFallback, getRecipeFallbackImage } from "../utils/imageFallbacks.js";

const transformExternalRecipeDetail = (recipe) => {
  const categoryTags = [recipe.category, recipe.cuisine].filter(Boolean);
  return {
    _id: recipe.id,
    title: recipe.title,
  imageUrl: recipe.image || recipe.imageUrl,
    ingredients: recipe.ingredients || [],
    steps: recipe.instructions || [],
    summary:
      recipe.instructions?.[0] ||
      `A ${recipe.cuisine || "flavourful"} favourite discovered through TheMealDB.`,
    cuisineType: recipe.cuisine || "Global",
    category: recipe.category,
    categoryTags,
    avgRating: null,
    cookingTime: null,
    createdBy: { name: "TheMealDB" },
    reviews: [],
    isExternal: true,
  };
};

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await apiRequest(`/recipes/${id}`);
        setRecipe({ ...response.recipe, reviews: response.recipe.reviews || [] });
      } catch (error) {
        if (error.status === 404) {
          try {
            const externalRecipe = await getExternalRecipeById(id);
            setRecipe(transformExternalRecipeDetail(externalRecipe));
          } catch (externalError) {
            addToast(externalError.message, "error");
          }
        } else {
          addToast(error.message, "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, addToast]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      addToast("Login to review recipes", "warning");
      return;
    }

    if (recipe?.isExternal) {
      addToast("Reviews are only available for Savora community recipes.", "info");
      return;
    }

    try {
      const response = await apiRequest(`/recipes/${id}/review`, {
        method: "POST",
        data: { rating, comment },
        token,
      });
      setRecipe({ ...response.recipe, reviews: response.recipe.reviews || [] });
      setComment("");
      addToast("Thanks for sharing your feedback!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: "Check out this Savora recipe!",
          url: window.location.href,
        });
      } catch (error) {
        addToast("Share cancelled", "info");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link copied to clipboard", "success");
    }
  };

  if (loading) {
    return (
      <div className="page page--center">
        <div className="loader">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page page--center">
        <p>Recipe not found.</p>
      </div>
    );
  }

  const timeLabel = recipe.cookingTime ? `${recipe.cookingTime} mins` : recipe.cuisineType || recipe.category || "Recipe";
  const ratingLabel = typeof recipe.avgRating === "number" ? recipe.avgRating.toFixed(1) : "–";
  const categoryLabel =
    recipe.categoryTags?.length
      ? recipe.categoryTags.join(", ")
      : recipe.category || recipe.cuisineType || "Global favourite";
  const summaryText =
    recipe.summary ||
    (recipe.isExternal
      ? "This dish arrives courtesy of TheMealDB community."
      : "Savora chefs are still adding a summary for this recipe.");
  const ingredientList = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const stepList = Array.isArray(recipe.steps) ? recipe.steps : [];
  const recipeImage =
    recipe.imageUrl ||
    getRecipeFallbackImage({ cuisine: recipe.cuisineType || recipe.cuisine, category: recipe.category, title: recipe.title });

  return (
    <div className="page recipe-detail">
      <header className="recipe-detail__hero gradient-dawn">
        <div className="recipe-detail__info">
          <h1>{recipe.title}</h1>
          <div className="recipe-detail__meta">
            <span>⏱ {timeLabel}</span>
            <span>★ {ratingLabel}</span>
            <span>{categoryLabel}</span>
          </div>
          <p>{summaryText}</p>
          <div className="recipe-detail__actions">
            <button type="button" className="btn btn--primary" onClick={handleShare}>
              Share recipe
            </button>
          </div>
        </div>
        <div className="recipe-detail__image">
          <img
            src={recipeImage}
            alt={recipe.title}
            onError={(event) =>
              applyRecipeImageFallback(event, {
                cuisine: recipe.cuisineType || recipe.cuisine,
                category: recipe.category,
                title: recipe.title,
              })
            }
          />
        </div>
      </header>

      <section className="recipe-detail__grid">
        <article className="panel">
          <h2>Ingredients</h2>
          <ul>
            {ingredientList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2>Steps</h2>
          <ol>
            {stepList.map((step, index) => (
              <li key={`${index}-${step}`}>{step}</li>
            ))}
          </ol>
        </article>
        <article className="panel">
          <h2>Nutrition</h2>
          <p>
            Savora creators can add nutrition details soon. For now, prioritize fresh ingredients and mindful portions.
          </p>
        </article>
      </section>

      <section className="panel">
        <h2>Reviews</h2>
        {recipe.isExternal ? (
          <p className="empty-state">
            Reviews aren&apos;t available for imported recipes yet, but you can still enjoy the steps straight from
            TheMealDB.
          </p>
        ) : (
          <>
            <div className="reviews">
              {recipe.reviews?.length ? (
                recipe.reviews.map((review) => (
                  <div key={review._id} className="reviews__item">
                    <div className="reviews__header">
                      <strong>{review.user?.name || "Savora Member"}</strong>
                      <span>★ {review.rating}</span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>Be the first to review this recipe.</p>
              )}
            </div>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Rate this recipe</h3>
              <RatingStars value={rating} onChange={setRating} />
              <textarea
                placeholder="Share your tips or tweaks"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <button type="submit" className="btn btn--primary">
                Submit review
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default RecipeDetailPage;
