import { getExternalRecipes } from "../utils/mockDb.js";

const matchQuery = (recipe, term) =>
  [recipe.title, recipe.cuisine, recipe.category]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(term));

export const searchExternalRecipes = async (query, { fallbackQuery = "a" } = {}) => {
  const trimmed = query?.trim().toLowerCase();
  const recipes = getExternalRecipes();

  const fallback = fallbackQuery?.trim().toLowerCase() || "a";
  const effectiveQuery = trimmed || fallback;
  const matches = recipes.filter((recipe) => matchQuery(recipe, effectiveQuery));

  const results = matches.length ? matches : recipes;

  return {
    query: effectiveQuery,
    requestedQuery: trimmed,
    usedFallback: !trimmed || !matches.length,
    recipes: results,
  };
};

export const getExternalRecipeById = async (id) => {
  const normalizedId = id?.trim();
  if (!normalizedId) {
    const error = new Error("A recipe id is required.");
    error.status = 400;
    throw error;
  }

  const recipe = getExternalRecipes().find((item) => item.id === normalizedId);
  if (!recipe) {
    const error = new Error("Recipe not found.");
    error.status = 404;
    throw error;
  }

  return recipe;
};
