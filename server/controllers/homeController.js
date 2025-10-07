import { HomeFeature } from "../models/HomeFeature.js";

export const getHomeContent = async (req, res, next) => {
  try {
    const features = await HomeFeature.find({ isActive: true })
      .sort({ section: 1, order: 1, createdAt: -1 })
      .lean({ getters: true, virtuals: false });

    const grouped = features.reduce(
      (acc, feature) => {
        const section = feature.section;
        if (!acc[section]) {
          acc[section] = [];
        }
        const normalized = { ...feature };
        if (normalized.meta instanceof Map) {
          normalized.meta = Object.fromEntries(normalized.meta.entries());
        }
        acc[section].push(normalized);
        return acc;
      },
      { hero: [], collection: [], quickPick: [], guide: [] }
    );

    return res.json({
      hero: grouped.hero,
      collections: grouped.collection,
      quickPicks: grouped.quickPick,
      guides: grouped.guide,
    });
  } catch (error) {
    next(error);
  }
};