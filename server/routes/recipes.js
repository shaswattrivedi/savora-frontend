import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addReview,
  createRecipe,
  deleteRecipe,
  getMyRecipes,
  getRecipeById,
  getRecipes,
  getTrendingRecipes,
  toggleBookmark,
  updateRecipe,
} from "../controllers/recipeController.js";

const router = Router();

router.get("/", getRecipes);
router.get("/trending", getTrendingRecipes);
router.get("/mine", protect, getMyRecipes);
router.get("/:id", getRecipeById);

router.post("/create", protect, createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/bookmark", protect, toggleBookmark);
router.post("/:id/review", protect, addReview);

export default router;
