import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: ["Recipe title is required"],
      trim: true,
    },
    summary: {
      type: String,
      maxlength: 220,
      default: "A delicious recipe shared by the Savora community.",
    },
    ingredients: {
      type: [String],
      required: ["Ingredients are required"],
      validate: [(val) => val.length > 0, "Add at least one ingredient"],
    },
    steps: {
      type: [String],
      required: ["Steps are required"],
      validate: [(val) => val.length > 0, "Provide at least one step"],
    },
    cookingTime: {
      type: Number,
      required: ["Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
    },
    cuisineType: {
      type: String,
      enum: [
        "Indian",
        "Italian",
        "Continental",
        "Asian",
        "Desserts",
        "Middle Eastern",
        "International",
      ],
      default: "International",
    },
    dietType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan"],
      default: "Veg",
    },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1498601768700-3a92fa6c8eeb?auto=format&fit=crop&w=800&q=80",
    },
    categoryTags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

recipeSchema.methods.recalculateStats = function recalculateStats() {
  if (!this.reviews || this.reviews.length === 0) {
    this.avgRating = 0;
    this.reviewCount = 0;
    return;
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.reviewCount = this.reviews.length;
  this.avgRating = Math.round((total / this.reviewCount) * 10) / 10;
};

export const Recipe = mongoose.model("Recipe", recipeSchema);
