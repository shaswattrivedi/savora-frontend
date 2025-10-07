import { Router } from "express";

const router = Router();
const THE_MEAL_DB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const createExternalError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeMeal = (meal) => {
  const instructions = meal?.strInstructions
    ? meal.strInstructions
        .split(/\r?\n/)
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
    : [];

  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal?.[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || "Unknown",
    cuisine: meal.strArea || "Unknown",
    instructions,
    ingredients,
    image: meal.strMealThumb,
  };
};

router.get("/recipes", async (req, res, next) => {
  const search = req.query.search?.trim();

  if (!search) {
    return next(createExternalError("Search query is required.", 400));
  }

  try {
    const response = await fetch(
      `${THE_MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(search)}`
    );

    if (!response.ok) {
      throw createExternalError(
        "Failed to fetch recipes from TheMealDB.",
        response.status >= 400 && response.status < 500 ? response.status : 502
      );
    }

    const data = await response.json();
    const meals = Array.isArray(data.meals) ? data.meals : [];

    if (meals.length === 0) {
      return next(
        createExternalError(`No recipes found for "${search}".`, 404)
      );
    }

    const recipes = meals.map(normalizeMeal);

    return res.json({
      query: search,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    if (error.status) {
      return next(error);
    }

    return next(
      createExternalError(
        "Unable to fetch recipes from TheMealDB at this time.",
        502
      )
    );
  }
});

router.get("/recipes/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createExternalError("Recipe ID is required.", 400));
  }

  try {
    const response = await fetch(
      `${THE_MEAL_DB_BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`
    );

    if (!response.ok) {
      throw createExternalError(
        "Failed to fetch the recipe from TheMealDB.",
        response.status >= 400 && response.status < 500 ? response.status : 502
      );
    }

    const data = await response.json();
    const meal = Array.isArray(data.meals) ? data.meals[0] : null;

    if (!meal) {
      return next(createExternalError(`Recipe ${id} was not found.`, 404));
    }

    return res.json(normalizeMeal(meal));
  } catch (error) {
    if (error.status) {
      return next(error);
    }

    return next(
      createExternalError(
        "Unable to fetch the requested recipe from TheMealDB.",
        502
      )
    );
  }
});

export default router;
