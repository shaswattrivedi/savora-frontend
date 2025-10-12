import matchaTiramisu from "../assets/matcha-tiramisu.png";

const CUISINE_FALLBACKS = {
  japanese: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
  italian: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  indian: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80",
  mediterranean: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  mexican: "https://images.unsplash.com/photo-1608031059821-ffa6fda3e2b9?auto=format&fit=crop&w=1200&q=80",
  asian: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
  spanish: "https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg",
  french: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80",
  american: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  thai: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  korean: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
  vietnamese: "https://images.unsplash.com/photo-1464219789935-c2d9d9d3bd59?auto=format&fit=crop&w=1200&q=80",
  greek: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  caribbean: "https://images.unsplash.com/photo-1600334129128-70e6043699e8?auto=format&fit=crop&w=1200&q=80",
};

const CATEGORY_FALLBACKS = {
  pasta: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  noodles: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
  dessert: "https://images.unsplash.com/photo-1542826438-1c56ea3a1f48?auto=format&fit=crop&w=1200&q=80",
  matcha: matchaTiramisu,
  soup: "https://images.unsplash.com/photo-1512058564366-c9e3ec356ef2?auto=format&fit=crop&w=1200&q=80",
  sandwich: "https://images.unsplash.com/photo-1543779503-7d4ba5c8c4ae?auto=format&fit=crop&w=1200&q=80",
  roast: "https://images.unsplash.com/photo-1514516430032-7d100ffb0074?auto=format&fit=crop&w=1200&q=80",
  breakfast: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
  beverage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
  seafood: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  beef: "https://images.unsplash.com/photo-1440103718860-0ec09be626d1?auto=format&fit=crop&w=1200&q=80",
  chicken: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  lamb: "https://images.unsplash.com/photo-1589308078054-83209a666d34?auto=format&fit=crop&w=1200&q=80",
  pork: "https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=1200&q=80",
  vegetarian: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  vegan: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1200&q=80",
  bread: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  starter: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  side: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1200&q=80",
  miscellaneous: "https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg",
};

const DEFAULT_FALLBACK_IMAGE = "https://cdn.pixabay.com/photo/2016/03/05/19/16/food-1239423_1280.jpg";

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const pushIfString = (collector, value) => {
  const normalized = normalize(value);
  if (normalized) collector.push(normalized);
};

const collectContextTokens = (context = {}) => {
  const tokens = [];
  const { title, subtitle, description, cuisine, category, tags, meta } = context;

  [title, subtitle, description, cuisine, category].forEach((value) => pushIfString(tokens, value));

  if (Array.isArray(tags)) {
    tags.forEach((tag) => pushIfString(tokens, tag));
  } else {
    pushIfString(tokens, tags);
  }

  if (meta && typeof meta === "object") {
    Object.values(meta).forEach((value) => pushIfString(tokens, value));
  }

  return tokens;
};

const CONTEXT_RULES = [
  {
    key: "matcha",
    force: true,
    keywords: ["matcha", "green tea"],
  },
  {
    key: "spanish",
    force: true,
    keywords: ["spanish", "paella", "tapas", "migas"],
  },
  {
    key: "dessert",
    force: true,
    keywords: [
      "dessert",
      "sweet",
      "pastry",
      "tiramisu",
      "no-bake",
      "confection",
      "mousse",
      "custard",
      "parfait",
      "meringue",
      "cake",
      "truffle",
      "macaron",
      "tart",
      "pie",
    ],
  },
  {
    key: "breakfast",
    force: true,
    keywords: ["breakfast", "brunch", "pancake", "waffle", "oat", "granola", "toast", "bagel"],
  },
  {
    key: "beverage",
    force: true,
    keywords: ["smoothie", "latte", "shake", "drink", "mocktail", "cocktail", "juice", "tea", "coffee"],
  },
  {
    key: "bread",
    force: true,
    keywords: ["bread", "crumb", "loaf", "focaccia", "baguette", "brioche"],
  },
  {
    key: "noodles",
    force: false,
    keywords: ["ramen", "noodle", "udon", "soba", "pho", "pad thai"],
  },
  {
    key: "sandwich",
    force: false,
    keywords: ["taco", "sandwich", "wrap", "burger", "panini", "sub"],
  },
  {
    key: "mediterranean",
    force: false,
    keywords: ["salmon", "fish", "seafood", "shrimp", "prawn", "tuna"],
  },
  {
    key: "seafood",
    force: true,
    keywords: ["salmon", "shrimp", "prawn", "lobster", "crab", "mussel", "clam", "octopus", "fish"],
  },
  {
    key: "chicken",
    force: false,
    keywords: ["chicken", "poultry", "wings", "thigh"],
  },
  {
    key: "beef",
    force: false,
    keywords: ["beef", "steak", "sirloin", "short rib"],
  },
  {
    key: "pork",
    force: false,
    keywords: ["pork", "bacon", "ham", "prosciutto", "chorizo"],
  },
  {
    key: "lamb",
    force: false,
    keywords: ["lamb", "mutton"],
  },
  {
    key: "vegan",
    force: false,
    keywords: ["vegan", "plant-based", "tofu", "tempeh"],
  },
  {
    key: "vegetarian",
    force: false,
    keywords: ["vegetarian", "veg-forward", "veggie", "meatless"],
  },
];

const FALLBACK_KEY_RESOLVERS = {
  dessert: () => CATEGORY_FALLBACKS.dessert,
  matcha: () => CATEGORY_FALLBACKS.matcha,
  breakfast: () => CATEGORY_FALLBACKS.breakfast,
  beverage: () => CATEGORY_FALLBACKS.beverage,
  spanish: () => CUISINE_FALLBACKS.spanish,
  bread: () => CATEGORY_FALLBACKS.bread,
  noodles: () => CATEGORY_FALLBACKS.noodles,
  sandwich: () => CATEGORY_FALLBACKS.sandwich,
  mediterranean: () => CUISINE_FALLBACKS.mediterranean,
  seafood: () => CATEGORY_FALLBACKS.seafood,
  chicken: () => CATEGORY_FALLBACKS.chicken,
  beef: () => CATEGORY_FALLBACKS.beef,
  pork: () => CATEGORY_FALLBACKS.pork,
  lamb: () => CATEGORY_FALLBACKS.lamb,
  vegan: () => CATEGORY_FALLBACKS.vegan,
  vegetarian: () => CATEGORY_FALLBACKS.vegetarian,
};

const resolveFallbackByKey = (key) => {
  const resolver = FALLBACK_KEY_RESOLVERS[key];
  return resolver ? resolver() : null;
};

const resolveContextualRule = (context = {}) => {
  const tokens = collectContextTokens(context);
  if (!tokens.length) return null;

  const haystack = tokens.join(" ");
  for (const rule of CONTEXT_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      const url = resolveFallbackByKey(rule.key);
      if (url) {
        return { url, force: rule.force };
      }
    }
  }

  return null;
};

export const shouldForceContextualFallback = (context = {}) => {
  const match = resolveContextualRule(context);
  return Boolean(match?.force);
};

export const getRecipeFallbackImage = (context = {}) => {
  const normalizedCuisine = normalize(context.cuisine);
  if (normalizedCuisine && CUISINE_FALLBACKS[normalizedCuisine]) {
    return CUISINE_FALLBACKS[normalizedCuisine];
  }

  const normalizedCategory = normalize(context.category);
  if (normalizedCategory && CATEGORY_FALLBACKS[normalizedCategory]) {
    return CATEGORY_FALLBACKS[normalizedCategory];
  }

  const contextualMatch = resolveContextualRule(context);
  if (contextualMatch?.url) {
    return contextualMatch.url;
  }

  const normalizedTitle = normalize(context.title);

  if (normalizedTitle.includes("ramen") || normalizedTitle.includes("noodle")) {
    return CATEGORY_FALLBACKS.noodles;
  }

  if (normalizedTitle.includes("taco") || normalizedTitle.includes("sandwich")) {
    return CATEGORY_FALLBACKS.sandwich;
  }

  if (normalizedTitle.includes("fish") || normalizedTitle.includes("salmon")) {
    return CUISINE_FALLBACKS.mediterranean;
  }

  return DEFAULT_FALLBACK_IMAGE;
};

const hasImageSource = (value) => typeof value === "string" && value.trim().length > 0;

export const selectRecipeImage = (candidates = [], context = {}) => {
  const sources = Array.isArray(candidates) ? candidates : [candidates];
  const fallback = getRecipeFallbackImage(context);
  const contextualMatch = resolveContextualRule(context);

  if (contextualMatch?.force) {
    return fallback;
  }

  const primary = sources.find((source) => hasImageSource(source));
  return primary || fallback;
};

export const applyRecipeImageFallback = (event, recipeContext = {}) => {
  if (!event?.currentTarget) return;
  const fallback = getRecipeFallbackImage(recipeContext);
  if (!fallback) return;
  const target = event.currentTarget;
  target.onerror = null;
  target.src = fallback;
};
