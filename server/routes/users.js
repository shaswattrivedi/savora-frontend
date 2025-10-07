import { Router } from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getTopContributors,
  updateProfile,
} from "../controllers/userController.js";

const router = Router();

router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.get("/top", getTopContributors);

// Admin tools
router.get("/", protect, requireAdmin, getAllUsers);
router.delete("/:id", protect, requireAdmin, deleteUser);

export default router;
