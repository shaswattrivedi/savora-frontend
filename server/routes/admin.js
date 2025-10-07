import { Router } from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import { getAdminRecipes, getAdminStats } from "../controllers/adminController.js";

const router = Router();

router.get("/stats", protect, requireAdmin, getAdminStats);
router.get("/recipes", protect, requireAdmin, getAdminRecipes);

export default router;
