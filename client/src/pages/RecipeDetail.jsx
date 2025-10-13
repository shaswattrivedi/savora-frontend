import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RatingStars from "../components/RatingStars.jsx";
import "../styles/contact.css";
import { apiRequest } from "../utils/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { getExternalRecipeById } from "../api/externalRecipes.js";
import { applyRecipeImageFallback, getRecipeFallbackImage } from "../utils/imageFallbacks.js";
import { getMockChefName } from "../utils/mockChefs.js";

const transformExternalRecipeDetail = (recipe) => {
  const categoryTags = [recipe.category, recipe.cuisine].filter(Boolean);
  const chefName = getMockChefName(recipe.id || recipe.title);
  return {
    _id: recipe.id,
    title: recipe.title,
    imageUrl: recipe.image || recipe.imageUrl,
    ingredients: recipe.ingredients || [],
    steps: recipe.instructions || [],
    summary:
      recipe.instructions?.[0] ||
      `Chef ${chefName} shares this ${recipe.cuisine || "flavourful"} favourite.`,
    cuisineType: recipe.cuisine || "Global",
    category: recipe.category,
    categoryTags,
    avgRating: null,
    cookingTime: null,
    createdBy: { name: chefName },
    reviews: [],
    isExternal: true,
  };
};

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);

  const ingredientList = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const stepList = Array.isArray(recipe?.steps) ? recipe.steps : [];
  const totalSteps = stepList.length;

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

  useEffect(() => {
    setActiveStepIndex(0);
  }, [id]);

  useEffect(() => {
    if (totalSteps === 0 && activeStepIndex !== 0) {
      setActiveStepIndex(0);
      return;
    }

    if (totalSteps > 0 && activeStepIndex >= totalSteps) {
      setActiveStepIndex(totalSteps - 1);
    }
  }, [activeStepIndex, totalSteps]);

  useEffect(() => {
    if (!recipe || recipe.isExternal || !user) {
      setIsFavourite(false);
      return;
    }

    const favouriteIds = new Set(
      (user.favorites || []).map((fav) => (typeof fav === "string" ? fav : fav?._id)).filter(Boolean)
    );
    setIsFavourite(favouriteIds.has(recipe._id));
  }, [recipe?._id, recipe?.isExternal, user]);

  const currentStep = totalSteps ? stepList[activeStepIndex] : null;
  const isPrevDisabled = totalSteps <= 1 || activeStepIndex === 0;
  const isNextDisabled = totalSteps <= 1 || activeStepIndex === totalSteps - 1;

  const showPreviousStep = () => {
    if (isPrevDisabled) return;
    setActiveStepIndex((current) => Math.max(current - 1, 0));
  };

  const showNextStep = () => {
    if (isNextDisabled) return;
    setActiveStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  };

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

  const handleToggleFavourite = async () => {
    if (!user) {
      addToast("Login to save favourites", "warning");
      return;
    }

    if (!recipe) {
      addToast("Recipe details are still loading.", "info");
      return;
    }

    if (!recipe?._id) {
      addToast("We can't save this recipe just yet.", "info");
      return;
    }

    if (recipe?.isExternal) {
      addToast("Favourites are only available for Savora community recipes.", "info");
      return;
    }

    try {
      const wasFavourite = isFavourite;
      const response = await apiRequest(`/recipes/${id}/bookmark`, {
        method: "POST",
        token,
      });

      if (response?.bookmarksCount !== undefined) {
        setRecipe((previous) =>
          previous ? { ...previous, bookmarksCount: response.bookmarksCount } : previous
        );
      }

      let nowFavourite = !wasFavourite;
      try {
        const updatedUser = await refreshProfile();
        const updatedFavourites = updatedUser?.favorites || [];
        nowFavourite = updatedFavourites
          .map((fav) => (typeof fav === "string" ? fav : fav?._id))
          .filter(Boolean)
          .includes(recipe._id);
      } catch (profileError) {
        console.error("Failed to refresh profile after bookmarking", profileError);
      }

      setIsFavourite(nowFavourite);

      if (!wasFavourite && nowFavourite) {
        navigate("/profile?tab=favorites");
      }

      if (response?.message) {
        addToast(response.message, "success");
      }
    } catch (error) {
      addToast(error.message || "Could not update favourites", "error");
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

  const externalChefName = recipe.createdBy?.name || getMockChefName(recipe._id || recipe.title);
  const timeLabel = recipe.cookingTime ? `${recipe.cookingTime} mins` : recipe.cuisineType || recipe.category || "Recipe";
  const reviewCount = recipe.reviews?.length || 0;
  const ratingLabel = typeof recipe.avgRating === "number" ? recipe.avgRating.toFixed(1) : "–";
  const categoryLabel =
    recipe.categoryTags?.length
      ? recipe.categoryTags.join(", ")
      : recipe.category || recipe.cuisineType || "Global favourite";
  const heroSubtitle = [recipe.cuisineType || recipe.cuisine, categoryLabel, `Chef ${externalChefName}`]
    .filter(Boolean)
    .map((part) => part.replace(/\s*,\s*/g, " • "))
    .join(" • ");
  const heroTag = recipe.cuisineType || recipe.category || "Featured";
  const summaryText =
    recipe.summary ||
    (recipe.isExternal
      ? `This dish arrives courtesy of Chef ${externalChefName}.`
      : "Savora chefs are still adding a summary for this recipe.");
  const recipeImage =
    recipe.imageUrl ||
    getRecipeFallbackImage({ cuisine: recipe.cuisineType || recipe.cuisine, category: recipe.category, title: recipe.title });
  const reviewIntro = recipe.isExternal
    ? `Reviews aren't available for imported recipes yet, but you can still enjoy the steps from Chef ${externalChefName}.`
    : reviewCount
      ? "See what the Savora community is saying and add your voice."
      : "Be the first to review this recipe.";

  return (
    <div className="page recipe-detail">
      <header className="home-hero recipe-detail__hero">
        <div className="home-hero__content">
          <span className="home-hero__tag">{heroTag}</span>
          <h1 className="home-hero__title">{recipe.title}</h1>
          {heroSubtitle && <p className="home-hero__subtitle">{heroSubtitle}</p>}
          <div className="home-hero__stats">
            <span>⏱ {timeLabel}</span>
            <span>★ {ratingLabel}</span>
            <span>{categoryLabel}</span>
          </div>
          <p className="home-hero__description">{summaryText}</p>
          <div className="home-hero__actions">
            <a href="#ingredients" className="btn btn--primary">
              Start cooking
            </a>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleToggleFavourite}
              aria-pressed={isFavourite}
              title={
                recipe.isExternal
                  ? "Imported recipes can't be saved yet."
                  : isFavourite
                    ? "Remove this recipe from your favourites"
                    : "Add this recipe to your favourites"
              }
            >
              {isFavourite ? "Remove from favourites" : "Add to favourites"}
            </button>
          </div>
        </div>
        <div className="home-hero__media">
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
        <article id="ingredients" className="panel recipe-detail__card recipe-detail__card--ingredients">
          <div className="recipe-detail__card-header">
            <h2>Ingredients</h2>
          </div>
          <div className="recipe-detail__card-body">
            <div className="recipe-detail__panel-content recipe-ingredients__content">
              <ul>
                {ingredientList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="panel recipe-detail__card recipe-detail__card--steps">
          <div className="recipe-detail__card-header">
            <h2>Steps</h2>
          </div>
          <div className="recipe-detail__card-body">
            {totalSteps ? (
              <div className="recipe-steps" role="group" aria-label="Recipe steps navigator">
                <button
                  type="button"
                  className="recipe-steps__arrow recipe-steps__arrow--prev"
                  onClick={showPreviousStep}
                  aria-label="Previous step"
                  disabled={isPrevDisabled}
                >
                  <span aria-hidden="true">‹</span>
                </button>

                <div className="recipe-detail__panel-content recipe-steps__content" aria-live="polite" aria-atomic="true">
                  <div className="recipe-steps__header">
                    <span className="recipe-steps__badge">Step {activeStepIndex + 1}</span>
                  </div>
                  <p className="recipe-steps__instruction">{currentStep}</p>
                </div>

                <button
                  type="button"
                  className="recipe-steps__arrow recipe-steps__arrow--next"
                  onClick={showNextStep}
                  aria-label="Next step"
                  disabled={isNextDisabled}
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            ) : (
              <p className="recipe-steps__empty">Our culinary editors are polishing these directions. Check back soon.</p>
            )}
          </div>
        </article>

        <article className="panel recipe-detail__card recipe-detail__card--nutrition">
          <div className="recipe-detail__card-header">
            <h2>Nutrition</h2>
          </div>
          <div className="recipe-detail__card-body">
            <div className="recipe-detail__panel-content recipe-nutrition__content">
              <p>
                Savora creators can add nutrition details soon. For now, prioritize fresh ingredients and mindful portions.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="reviews-section" aria-labelledby="recipe-reviews-heading">
        <article className="panel recipe-detail__card recipe-detail__card--reviews">
          <div className="recipe-detail__card-header">
            <h2 id="recipe-reviews-heading">Reviews</h2>
          </div>
          <div className="recipe-detail__card-body">
            {recipe.isExternal ? (
              <div className="recipe-detail__panel-content recipe-reviews__content recipe-reviews__content--message">
                <p>
                  Reviews aren&apos;t available for imported recipes yet, but you can still enjoy every step curated by Chef {externalChefName}.
                </p>
              </div>
            ) : (
              <div className="recipe-detail__panel-content review-panel">
                <div className="review-panel__column review-panel__column--overview">
                  <p className="review-panel__intro">{reviewIntro}</p>
                  {reviewCount ? (
                    <ul className="review-panel__list">
                      {recipe.reviews.map((review) => (
                        <li key={review._id} className="review-panel__item">
                          <div className="review-panel__item-header">
                            <span className="review-panel__author">{review.user?.name || "Savora Member"}</span>
                            <span className="review-panel__rating" aria-label={`Rated ${review.rating} out of 5`}>
                              ★ {review.rating}
                            </span>
                          </div>
                          {review.comment && <p className="review-panel__comment">{review.comment}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="review-panel__empty" role="status">
                      <p>No reviews yet. Your tips could help the next cook!</p>
                    </div>
                  )}
                </div>

                <div className="review-panel__column review-panel__column--form">
                  <form className="contact-form review-panel__form" onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="review-panel__label" htmlFor="recipe-review-rating">
                        Rate this recipe
                      </label>
                      <div className="review-panel__stars" id="recipe-review-rating">
                        <RatingStars value={rating} onChange={setRating} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="review-panel__label" htmlFor="recipe-review-comment">
                        Share your tips or tweaks
                      </label>
                      <textarea
                        id="recipe-review-comment"
                        className="input-glass review-panel__textarea"
                        placeholder="What did you change or love about this recipe?"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn--primary contact-btn review-panel__submit">
                      Submit review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default RecipeDetailPage;
