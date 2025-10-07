import mongoose from "mongoose";

const homeFeatureSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["hero", "collection", "quickPick", "guide"],
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    ctaLabel: {
      type: String,
      trim: true,
      default: "",
    },
    ctaHref: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    meta: {
      type: Map,
      of: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HomeFeature = mongoose.model("HomeFeature", homeFeatureSchema);