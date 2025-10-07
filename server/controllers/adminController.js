import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";

/**
 * Provide quick statistics for the admin dashboard cards.
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [userCount, recipeCount, topRecipe] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.findOne().sort({ bookmarksCount: -1, avgRating: -1 }).select("title bookmarksCount avgRating"),
    ]);

    return res.json({
      stats: {
        userCount,
        recipeCount,
        popularRecipe: topRecipe,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List recipes with author info for moderation tables.
 */
export const getAdminRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", select: "name email" })
      .lean();

    return res.json({ recipes });
  } catch (error) {
    next(error);
  }
};
