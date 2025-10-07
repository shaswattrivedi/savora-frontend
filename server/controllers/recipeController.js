import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const sortMap = {
  recent: { createdAt: -1 },
  rating: { avgRating: -1 },
  popular: { bookmarksCount: -1 },
};

/**
 * Fetch paginated recipes with optional search and filter criteria.
 */
export const getRecipes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      cuisine,
      diet,
      category,
      sort = "recent",
    } = req.query;

    const filters = {};

    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }
    if (cuisine) {
      filters.cuisineType = cuisine;
    }
    if (diet) {
      filters.dietType = diet;
    }
    if (category) {
      filters.categoryTags = { $in: [category] };
    }

    const pageNumber = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 9, 24);

    const total = await Recipe.countDocuments(filters);
    const recipes = await Recipe.find(filters)
      .populate({ path: "createdBy", select: "name avatarUrl" })
      .sort(sortMap[sort] || sortMap.recent)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.json({
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch the authenticated user's recipes without needing query params.
 */
export const getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ recipes });
  } catch (error) {
    next(error);
  }
};

/**
 * Return the most recent or relevant trending recipes.
 */
export const getTrendingRecipes = async (req, res, next) => {
  try {
    const trending = await Recipe.find()
      .sort({ avgRating: -1, bookmarksCount: -1 })
      .limit(6)
      .populate({ path: "createdBy", select: "name" });

    return res.json({ recipes: trending });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single recipe with populated fields.
 */
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate({ path: "createdBy", select: "name avatarUrl bio" })
      .populate({
        path: "reviews.user",
        select: "name avatarUrl",
      });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json({ recipe });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new recipe entry owned by the authenticated user.
 */
export const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      ingredients,
      steps,
      cookingTime,
      cuisineType,
      dietType,
      imageUrl,
      categoryTags,
    } = req.body;

    if (!title || !ingredients || !steps || !cookingTime) {
      return res
        .status(400)
        .json({ message: "Title, ingredients, steps and cooking time are required" });
    }

    const recipe = await Recipe.create({
      title,
      summary,
      ingredients: parseArrayField(ingredients),
      steps: parseArrayField(steps),
      cookingTime,
      cuisineType,
      dietType,
      imageUrl,
      categoryTags: parseArrayField(categoryTags),
      createdBy: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { recipesShared: 1 } });

    return res.status(201).json({ message: "Recipe published", recipe });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing recipe. Owners and admins are allowed to edit.
 */
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const isOwner = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You cannot edit this recipe" });
    }

    const fields = [
      "title",
      "summary",
      "cookingTime",
      "cuisineType",
      "dietType",
      "imageUrl",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    if (req.body.ingredients) {
      recipe.ingredients = parseArrayField(req.body.ingredients);
    }

    if (req.body.steps) {
      recipe.steps = parseArrayField(req.body.steps);
    }

    if (req.body.categoryTags) {
      recipe.categoryTags = parseArrayField(req.body.categoryTags);
    }

    await recipe.save();

    return res.json({ message: "Recipe updated", recipe });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a recipe (owner or admin) and update contributor stats.
 */
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const isOwner = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You cannot delete this recipe" });
    }

    await recipe.deleteOne();
    await User.findByIdAndUpdate(recipe.createdBy, { $inc: { recipesShared: -1 } });

    return res.json({ message: "Recipe removed" });
  } catch (error) {
    next(error);
  }
};

/**
 * Bookmark or un-bookmark a recipe for the authenticated user.
 */
export const toggleBookmark = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const alreadyBookmarked = req.user.favorites.some(
      (favId) => favId.toString() === recipe._id.toString()
    );

    if (alreadyBookmarked) {
      req.user.favorites = req.user.favorites.filter(
        (favId) => favId.toString() !== recipe._id.toString()
      );
      recipe.bookmarksCount = Math.max(0, recipe.bookmarksCount - 1);
    } else {
      req.user.favorites.push(recipe._id);
      recipe.bookmarksCount += 1;
    }

    await req.user.save();
    await recipe.save();

    return res.json({
      message: alreadyBookmarked ? "Removed from bookmarks" : "Saved to bookmarks",
      bookmarksCount: recipe.bookmarksCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add or update a review for the recipe by the authenticated user.
 */
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingReview = recipe.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      recipe.reviews.push({ user: req.user._id, rating, comment });
    }

    recipe.recalculateStats();
    await recipe.save();

    return res.status(201).json({ message: "Thanks for the feedback!", recipe });
  } catch (error) {
    next(error);
  }
};
