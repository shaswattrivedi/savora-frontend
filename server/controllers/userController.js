import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";

/**
 * Return the authenticated user's profile and lightweight dashboard stats.
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: "favorites", select: "title cuisineType avgRating imageUrl" })
      .lean();

    const recipesCount = await Recipe.countDocuments({ createdBy: req.user._id });

    return res.json({
      user: {
        ...user,
        recipesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update editable fields on the current user's profile.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl) updates.avatarUrl = avatarUrl;

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({
      message: "Profile updated",
      user: updated.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Expose the top contributors based on number of recipes shared.
 */
export const getTopContributors = async (req, res, next) => {
  try {
    const contributors = await User.find({ recipesShared: { $gt: 0 } })
      .sort({ recipesShared: -1 })
      .limit(6)
      .select("name avatarUrl bio recipesShared");

    return res.json({ contributors });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin utility – list all users.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email role recipesShared createdAt");
    return res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin utility – delete a user and cascade clean-up of their recipes.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Recipe.deleteMany({ createdBy: id });
    await user.deleteOne();

    return res.json({ message: "User and recipes removed" });
  } catch (error) {
    next(error);
  }
};
