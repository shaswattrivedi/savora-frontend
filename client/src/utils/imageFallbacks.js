import matchaTiramisu from "../assets/matcha-tiramisu.png";

const CUISINE_FALLBACKS = {
  japanese: "https://cdn.pixabay.com/photo/2017/09/02/13/11/ramen-2701613_1280.jpg",
  italian: "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
  indian: "https://cdn.pixabay.com/photo/2017/07/07/13/44/indian-food-2485282_1280.jpg",
  mediterranean: "https://cdn.pixabay.com/photo/2018/01/15/07/51/seafood-3081552_1280.jpg",
  mexican: "https://cdn.pixabay.com/photo/2017/03/17/11/17/tacos-2156699_1280.jpg",
  asian: "https://cdn.pixabay.com/photo/2016/03/05/19/02/sushi-1233511_1280.jpg",
};

const CATEGORY_FALLBACKS = {
  pasta: "https://cdn.pixabay.com/photo/2015/05/13/16/08/pasta-765705_1280.jpg",
  noodles: "https://cdn.pixabay.com/photo/2016/11/18/15/27/ramen-1836540_1280.jpg",
  dessert: "https://cdn.pixabay.com/photo/2017/08/07/15/53/ice-cream-2607705_1280.jpg",
  matcha: matchaTiramisu,
  soup: "https://cdn.pixabay.com/photo/2017/11/23/08/16/soup-2973298_1280.jpg",
  sandwich: "https://cdn.pixabay.com/photo/2015/05/31/12/14/sandwiches-791205_1280.jpg",
  roast: "https://cdn.pixabay.com/photo/2014/12/16/22/25/chicken-571271_1280.jpg",
  breakfast: "https://cdn.pixabay.com/photo/2017/08/07/07/50/pancakes-2604178_1280.jpg",
  beverage: "https://cdn.pixabay.com/photo/2015/06/19/21/24/smoothies-815607_1280.jpg",
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
];

const FALLBACK_KEY_RESOLVERS = {
  dessert: () => CATEGORY_FALLBACKS.dessert,
  matcha: () => CATEGORY_FALLBACKS.matcha,
  breakfast: () => CATEGORY_FALLBACKS.breakfast,
  beverage: () => CATEGORY_FALLBACKS.beverage,
  noodles: () => CATEGORY_FALLBACKS.noodles,
  sandwich: () => CATEGORY_FALLBACKS.sandwich,
  mediterranean: () => CUISINE_FALLBACKS.mediterranean,
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
