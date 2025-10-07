import { apiRequest } from "../utils/api.js";

const EXTERNAL_BASE = "/external";

export const searchExternalRecipes = async (query, { fallbackQuery = "a" } = {}) => {
  const trimmed = query?.trim();
  const effectiveQuery = trimmed || fallbackQuery?.trim();

  if (!effectiveQuery) {
    throw new Error("A search term is required.");
  }

  const data = await apiRequest(`${EXTERNAL_BASE}/recipes`, {
    params: { search: effectiveQuery },
  });

  return {
    ...data,
    requestedQuery: trimmed,
    usedFallback: !trimmed,
  };
};

export const getExternalRecipeById = async (id) => {
  const normalizedId = id?.trim();
  if (!normalizedId) {
    throw new Error("A recipe id is required.");
  }

  return apiRequest(`${EXTERNAL_BASE}/recipes/${normalizedId}`);
};
