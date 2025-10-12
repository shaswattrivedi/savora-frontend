import { getExternalRecipes } from "../utils/mockDb.js";
import { selectRecipeImage } from "../utils/imageFallbacks.js";

const THE_MEAL_DB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const coerceToString = (value) => (typeof value === "string" ? value : value ? String(value) : "").trim();

const matchQuery = (recipe, term) =>
  [recipe.title, recipe.cuisine, recipe.category]
    .filter(Boolean)
    .some((value) => coerceToString(value).toLowerCase().includes(term));

const applyFallbackImage = (recipe) => {
  const imageUrl = selectRecipeImage([recipe.image, recipe.imageUrl], {
    title: recipe.title,
    cuisine: recipe.cuisine,
    category: recipe.category,
    tags: recipe.tags,
  });

  return { ...recipe, image: imageUrl, imageUrl };
};

const parseInstructions = (instructions) =>
  coerceToString(instructions)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const extractIngredients = (meal) => {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];

    if (!ingredient || !ingredient.trim()) continue;
    const formattedMeasure = measure?.trim() ? ` - ${measure.trim()}` : "";
    ingredients.push(`${ingredient.trim()}${formattedMeasure}`);
  }
  return ingredients;
};

const normalizeMealDbRecipe = (meal) => {
  if (!meal) return null;

  return applyFallbackImage({
    id: coerceToString(meal.idMeal),
    title: coerceToString(meal.strMeal),
    image: coerceToString(meal.strMealThumb),
    cuisine: coerceToString(meal.strArea),
    category: coerceToString(meal.strCategory),
    tags: coerceToString(meal.strTags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    instructions: parseInstructions(meal.strInstructions),
    sourceUrl: coerceToString(meal.strSource),
    youtubeUrl: coerceToString(meal.strYoutube),
    ingredients: extractIngredients(meal),
  });
};

const fetchFromTheMealDB = async (searchValue) => {
  const trimmed = coerceToString(searchValue);
  if (!trimmed) return [];

  try {
    const url = `${THE_MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TheMealDB request failed: ${response.status}`);
    }

    const payload = await response.json();
    if (!payload?.meals?.length) {
      return [];
    }

    return payload.meals.map(normalizeMealDbRecipe).filter(Boolean);
  } catch (error) {
    console.error("Failed to fetch TheMealDB recipes", error);
    return [];
  }
};

const dedupeRecipes = (recipes) => {
  const map = new Map();
  recipes.forEach((recipe) => {
    if (!recipe) return;
    if (map.has(recipe.id)) return;
    map.set(recipe.id, recipe);
  });
  return Array.from(map.values());
};

export const searchExternalRecipes = async (query, { fallbackQuery = "a" } = {}) => {
  const requestedQuery = coerceToString(query).toLowerCase();
  const fallback = coerceToString(fallbackQuery).toLowerCase() || "a";

  const localRecipes = getExternalRecipes().map(applyFallbackImage).filter(Boolean);

  const primaryRemote = await fetchFromTheMealDB(requestedQuery || fallback);
  let remoteRecipes = primaryRemote;

  if (!remoteRecipes.length && requestedQuery && requestedQuery !== fallback) {
    remoteRecipes = await fetchFromTheMealDB(fallback);
  }

  const combined = dedupeRecipes([...remoteRecipes, ...localRecipes]);

  const effectiveQuery = requestedQuery || fallback;
  const filtered = requestedQuery
    ? combined.filter((recipe) => matchQuery(recipe, requestedQuery))
    : combined;

  const finalRecipes = filtered.length ? filtered : combined;
  const usedFallback = !requestedQuery || (!filtered.length && !primaryRemote.length);

  return {
    query: effectiveQuery,
    requestedQuery: requestedQuery || null,
    usedFallback,
    recipes: finalRecipes,
  };
};

export const getExternalRecipeById = async (id) => {
  const normalizedId = coerceToString(id);
  if (!normalizedId) {
    const error = new Error("A recipe id is required.");
    error.status = 400;
    throw error;
  }

  const localRecipe = getExternalRecipes()
    .map(applyFallbackImage)
    .find((item) => item.id === normalizedId);

  if (localRecipe) {
    return localRecipe;
  }

  try {
    const url = `${THE_MEAL_DB_BASE_URL}/lookup.php?i=${encodeURIComponent(normalizedId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TheMealDB lookup failed: ${response.status}`);
    }

    const payload = await response.json();
    if (!payload?.meals?.length) {
      const notFound = new Error("Recipe not found.");
      notFound.status = 404;
      throw notFound;
    }

    const meal = normalizeMealDbRecipe(payload.meals[0]);
    if (!meal) {
      const invalid = new Error("Recipe not found.");
      invalid.status = 404;
      throw invalid;
    }

    return meal;
  } catch (error) {
    if (error.status === 404) {
      throw error;
    }
    const wrapped = new Error("Unable to load recipe at this time.");
    wrapped.status = 502;
    throw wrapped;
  }
};
