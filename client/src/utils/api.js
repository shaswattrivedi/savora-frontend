import { loadDb, saveDb } from "./mockDb.js";

const delay = (result, ms = 160) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(result), ms);
  });

const clone = (value) =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getAuthUser = (db, token) => {
  if (!token) return null;
  return db.users.find((user) => user._id === token) || null;
};

const ensureAuth = (db, token) => {
  const user = getAuthUser(db, token);
  if (!user) {
    throw createError("You need to be logged in to continue.", 401);
  }
  return user;
};

const ensureAdmin = (db, token) => {
  const user = ensureAuth(db, token);
  if (user.role !== "admin") {
    throw createError("Admin access required.", 403);
  }
  return user;
};

const calculateAverageRating = (reviews = []) => {
  if (!reviews.length) return null;
  const sum = reviews.reduce((total, review) => total + Number(review.rating || 0), 0);
  return Number((sum / reviews.length).toFixed(1));
};

const enrichReview = (review, db) => {
  const reviewer = db.users.find((user) => user._id === review.userId);
  return {
    _id: review._id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    user: reviewer
      ? { _id: reviewer._id, name: reviewer.name, avatarUrl: reviewer.avatarUrl }
      : { name: "Savora Member" },
  };
};

const enrichRecipe = (recipe, db) => {
  if (!recipe) return null;
  const createdByUser = db.users.find((user) => user._id === recipe.createdBy?.id);
  const createdBy = {
    id: recipe.createdBy?.id || createdByUser?._id || "savora",
    name: recipe.createdBy?.name || createdByUser?.name || "Savora Chef",
  };

  return {
    ...clone(recipe),
    createdBy,
    reviews: (recipe.reviews || []).map((review) => enrichReview(review, db)),
    avgRating: recipe.avgRating ?? calculateAverageRating(recipe.reviews),
    isExternal: false,
  };
};

const sanitizeRecipes = (recipes, db) => recipes.map((recipe) => enrichRecipe(recipe, db));

const enrichUser = (user, db) => {
  if (!user) return null;
  const createdRecipes = db.recipes.filter((recipe) => recipe.createdBy?.id === user._id);
  const favorites = (user.favorites || [])
    .map((recipeId) => db.recipes.find((recipe) => recipe._id === recipeId))
    .filter(Boolean)
    .map((recipe) => enrichRecipe(recipe, db));

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio || "",
    avatarUrl:
      user.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b6b&color=ffffff&format=png`,
    favorites,
    recipesShared: user.recipesShared ?? createdRecipes.length,
  };
};

const parseMultiline = (value) =>
  value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseCategoryTags = (value = "") =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const ensureDefaultImage = (imageUrl, fallbackText) =>
  imageUrl ||
  `https://source.unsplash.com/featured/900x600/?food,${encodeURIComponent(fallbackText || "recipe")}`;

const nextId = (prefix, db) => {
  const current = db.nextIds?.[prefix] ?? 1;
  if (!db.nextIds) db.nextIds = {};
  db.nextIds[prefix] = current + 1;
  return `${prefix}_${current}`;
};

const syncContributors = (db) => {
  const contributors = db.users.map((user) => {
    const recipesShared =
      user.recipesShared ?? db.recipes.filter((recipe) => recipe.createdBy?.id === user._id).length;
    return {
      _id: user._id,
      name: user.name,
      bio: user.bio || "",
      avatarUrl:
        user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6f61&color=ffffff&format=png`,
      recipesShared,
    };
  });

  db.contributors = contributors.sort((a, b) => (b.recipesShared || 0) - (a.recipesShared || 0)).slice(0, 9);
};

const filterRecipes = (recipes, params = {}) => {
  const { search, category, cuisine, diet, sort } = params;
  let result = [...recipes];

  if (search) {
    const term = search.trim().toLowerCase();
    result = result.filter((recipe) =>
      [
        recipe.title,
        recipe.summary,
        recipe.cuisineType,
        recipe.category,
        ...(recipe.categoryTags || []),
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  if (category) {
    const target = category.toLowerCase();
    result = result.filter((recipe) => {
      const tags = [recipe.category, ...(recipe.categoryTags || [])]
        .filter(Boolean)
        .map((tag) => tag.toLowerCase());
      return tags.includes(target);
    });
  }

  if (cuisine) {
    const target = cuisine.toLowerCase();
    result = result.filter((recipe) => recipe.cuisineType?.toLowerCase() === target);
  }

  if (diet) {
    const target = diet.toLowerCase();
    result = result.filter((recipe) => recipe.dietType?.toLowerCase() === target);
  }

  switch (sort) {
    case "popular":
      result.sort((a, b) => (b.bookmarksCount || 0) - (a.bookmarksCount || 0));
      break;
    case "rating":
      result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
      break;
    case "time":
      result.sort((a, b) => (a.cookingTime || 0) - (b.cookingTime || 0));
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
};

const paginate = (items, page = 1, pageSize = 9) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    pagination: { page: currentPage, totalPages },
  };
};

export const apiRequest = async (
  endpoint,
  { method = "GET", data = {}, token, params = {} } = {}
) => {
  const db = loadDb();
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const [resource, action, subAction] = path.split("/");

  if (!resource) {
    return delay({ message: "Savora mock API ready." });
  }

  // Home content & discovery
  if (resource === "home" && method === "GET") {
    return delay(clone(db.home));
  }

  if (resource === "users" && action === "top" && method === "GET") {
    return delay({ contributors: clone(db.contributors) });
  }

  if (resource === "recipes" && action === "trending" && method === "GET") {
    const trending = [...db.recipes]
      .sort((a, b) => (b.bookmarksCount || 0) - (a.bookmarksCount || 0))
      .slice(0, 6);
    return delay({ recipes: sanitizeRecipes(trending, db) });
  }

  if (resource === "recipes" && !action && method === "GET") {
    const filtered = filterRecipes(db.recipes, params);
    const page = Number(params.page || 1);
    const { items, pagination } = paginate(filtered, page);
    return delay({ recipes: sanitizeRecipes(items, db), pagination });
  }

  if (resource === "recipes" && action === "mine" && method === "GET") {
    const user = ensureAuth(db, token);
    const mine = db.recipes.filter((recipe) => recipe.createdBy?.id === user._id);
    return delay({ recipes: sanitizeRecipes(mine, db) });
  }

  if (resource === "recipes" && action === "create" && method === "POST") {
    const user = ensureAuth(db, token);
    const recipeId = nextId("recipe", db);
    const categoryTags = parseCategoryTags(data.categoryTags);
    const newRecipe = {
      _id: recipeId,
      title: data.title,
      summary: data.summary || "A brand new Savora community recipe.",
      imageUrl: ensureDefaultImage(data.imageUrl, data.title),
      cuisineType: data.cuisineType || "International",
      dietType: data.dietType || "Veg",
      category: categoryTags[0] || data.category || "Community",
      categoryTags,
      cookingTime: Number(data.cookingTime) || 30,
      createdAt: new Date().toISOString(),
      createdBy: { id: user._id, name: user.name },
      ingredients: parseMultiline(data.ingredients || ""),
      steps: parseMultiline(data.steps || ""),
      avgRating: null,
      bookmarksCount: 0,
      reviews: [],
    };

    db.recipes.unshift(newRecipe);
    user.recipesShared = (user.recipesShared || 0) + 1;
    syncContributors(db);
    saveDb(db);

    return delay({ recipe: enrichRecipe(newRecipe, db) });
  }

  if (resource === "recipes" && action && method === "GET" && !subAction) {
    const recipe = db.recipes.find((item) => item._id === action);
    if (!recipe) {
      throw createError("Recipe not found.", 404);
    }
    return delay({ recipe: enrichRecipe(recipe, db) });
  }

  if (resource === "recipes" && action && subAction === "bookmark" && method === "POST") {
    const user = ensureAuth(db, token);
    const recipe = db.recipes.find((item) => item._id === action);
    if (!recipe) {
      throw createError("Recipe not found.", 404);
    }

    const favorites = new Set(user.favorites || []);
    const alreadySaved = favorites.has(recipe._id);
    if (alreadySaved) {
      favorites.delete(recipe._id);
      recipe.bookmarksCount = Math.max(0, (recipe.bookmarksCount || 0) - 1);
    } else {
      favorites.add(recipe._id);
      recipe.bookmarksCount = (recipe.bookmarksCount || 0) + 1;
    }
    user.favorites = Array.from(favorites);
    saveDb(db);

    return delay({
      message: alreadySaved ? "Removed from favourites." : "Added to favourites!",
      bookmarksCount: recipe.bookmarksCount,
    });
  }

  if (resource === "recipes" && action && subAction === "review" && method === "POST") {
    const user = ensureAuth(db, token);
    const recipe = db.recipes.find((item) => item._id === action);
    if (!recipe) {
      throw createError("Recipe not found.", 404);
    }

    const reviewId = nextId("review", db);
    const newReview = {
      _id: reviewId,
      userId: user._id,
      rating: Number(data.rating) || 5,
      comment: (data.comment || "").trim() || "Loved cooking this recipe!",
      createdAt: new Date().toISOString(),
    };

    const existingIndex = recipe.reviews.findIndex((review) => review.userId === user._id);
    if (existingIndex >= 0) {
      recipe.reviews[existingIndex] = newReview;
    } else {
      recipe.reviews.push(newReview);
    }
    recipe.avgRating = calculateAverageRating(recipe.reviews);
    saveDb(db);

    return delay({ recipe: enrichRecipe(recipe, db) });
  }

  if (resource === "recipes" && action && !subAction && method === "PUT") {
    const user = ensureAuth(db, token);
    const recipe = db.recipes.find((item) => item._id === action);
    if (!recipe) {
      throw createError("Recipe not found.", 404);
    }
    if (recipe.createdBy?.id !== user._id && user.role !== "admin") {
      throw createError("You can only edit recipes you created.", 403);
    }

    const categoryTags = parseCategoryTags(data.categoryTags);
    Object.assign(recipe, {
      title: data.title,
      summary: data.summary,
      imageUrl: ensureDefaultImage(data.imageUrl, data.title),
      cuisineType: data.cuisineType,
      dietType: data.dietType,
      category: categoryTags[0] || recipe.category,
      categoryTags,
      cookingTime: Number(data.cookingTime) || recipe.cookingTime,
      ingredients: parseMultiline(data.ingredients || recipe.ingredients.join("\n")),
      steps: parseMultiline(data.steps || recipe.steps.join("\n")),
    });

    saveDb(db);
    return delay({ recipe: enrichRecipe(recipe, db) });
  }

  if (resource === "recipes" && action && !subAction && method === "DELETE") {
    const user = ensureAdmin(db, token);
    const recipeIndex = db.recipes.findIndex((item) => item._id === action);
    if (recipeIndex === -1) {
      throw createError("Recipe not found.", 404);
    }
    const [removed] = db.recipes.splice(recipeIndex, 1);
    db.users.forEach((member) => {
      member.favorites = (member.favorites || []).filter((id) => id !== removed._id);
    });
    syncContributors(db);
    saveDb(db);
    return delay({ message: "Recipe removed." });
  }

  if (resource === "auth" && action === "login" && method === "POST") {
    const email = (data.email || "").trim().toLowerCase();
    const password = data.password || "";
    const user = db.users.find(
      (candidate) => candidate.email.toLowerCase() === email && candidate.password === password
    );
    if (!user) {
      throw createError("Invalid credentials. Try again.", 401);
    }
    return delay({ token: user._id, user: enrichUser(user, db) });
  }

  if (resource === "auth" && action === "register" && method === "POST") {
    const email = (data.email || "").trim().toLowerCase();
    if (!email || !data.password || !data.name) {
      throw createError("Name, email, and password are required.");
    }

    const emailExists = db.users.some((user) => user.email.toLowerCase() === email);
    if (emailExists) {
      throw createError("An account with that email already exists.", 409);
    }

    const userId = nextId("user", db);
    const newUser = {
      _id: userId,
      name: data.name,
      email,
      password: data.password,
      role: "user",
      bio: "",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6a82fb&color=ffffff&format=png`,
      favorites: [],
      recipesShared: 0,
    };

    db.users.push(newUser);
    syncContributors(db);
    saveDb(db);

    return delay({ token: newUser._id, user: enrichUser(newUser, db) });
  }

  if (resource === "users" && action === "me" && method === "GET") {
    const user = ensureAuth(db, token);
    return delay({ user: enrichUser(user, db) });
  }

  if (resource === "users" && action === "update" && method === "PUT") {
    const user = ensureAuth(db, token);
    user.name = data.name || user.name;
    user.bio = data.bio ?? user.bio;
    user.avatarUrl = data.avatarUrl || user.avatarUrl;
    syncContributors(db);
    saveDb(db);
    return delay({ user: enrichUser(user, db) });
  }

  if (resource === "users" && !action && method === "GET") {
    ensureAdmin(db, token);
    const users = db.users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      recipesShared: user.recipesShared ??
        db.recipes.filter((recipe) => recipe.createdBy?.id === user._id).length,
    }));
    return delay({ users });
  }

  if (resource === "users" && action && method === "DELETE") {
    const admin = ensureAdmin(db, token);
    if (admin._id === action) {
      throw createError("You cannot delete your own account while signed in.", 400);
    }
    const index = db.users.findIndex((user) => user._id === action);
    if (index === -1) {
      throw createError("User not found.", 404);
    }
    db.users.splice(index, 1);
    const removedRecipeIds = db.recipes
      .filter((recipe) => recipe.createdBy?.id === action)
      .map((recipe) => recipe._id);
    db.recipes = db.recipes.filter((recipe) => recipe.createdBy?.id !== action);
    if (removedRecipeIds.length) {
      db.users.forEach((user) => {
        user.favorites = (user.favorites || []).filter((recipeId) => !removedRecipeIds.includes(recipeId));
      });
    }
    syncContributors(db);
    saveDb(db);
    return delay({ message: "User deleted." });
  }

  if (resource === "admin" && action === "stats" && method === "GET") {
    ensureAdmin(db, token);
    const userCount = db.users.length;
    const recipeCount = db.recipes.length;
    const popularRecipe = [...db.recipes].sort((a, b) => (b.bookmarksCount || 0) - (a.bookmarksCount || 0))[0];
    return delay({
      stats: {
        userCount,
        recipeCount,
        popularRecipe: popularRecipe
          ? {
              title: popularRecipe.title,
              bookmarksCount: popularRecipe.bookmarksCount || 0,
              avgRating: popularRecipe.avgRating || calculateAverageRating(popularRecipe.reviews),
            }
          : null,
      },
    });
  }

  if (resource === "admin" && action === "recipes" && method === "GET") {
    ensureAdmin(db, token);
    return delay({ recipes: sanitizeRecipes(db.recipes, db) });
  }

  if (resource === "contact" && method === "POST") {
    return delay({ message: "Thanks for contacting Savora!" });
  }

  throw createError(`Unsupported endpoint: ${endpoint}`);
};
