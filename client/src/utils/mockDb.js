const STORAGE_KEY = "savora_mock_db_v2";

const clone = (value) =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const DEFAULT_USERS = [
  {
    _id: "user_ayesha",
    name: "Ayesha Patel",
    email: "ayesha@savora.dev",
    password: "tastebud",
    role: "admin",
    bio: "Creative director of Savora's kitchen studio and champion of bold spices.",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
    recipesShared: 4,
    favorites: ["recipe_matcha_tiramisu", "recipe_shrimp_tacos"],
  },
  {
    _id: "user_mateo",
    name: "Mateo Rossi",
    email: "mateo@savora.dev",
    password: "savora123",
    role: "user",
    bio: "Pasta evangelist bringing vibrant Italian flavours to weeknight cooking.",
    avatarUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&q=80",
    recipesShared: 3,
    favorites: ["recipe_honey_chili_salmon"],
  },
  {
    _id: "user_grace",
    name: "Grace Chen",
    email: "grace@savora.dev",
    password: "taste123",
    role: "user",
    bio: "Meal prep strategist focused on colourful, veg-forward plates.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    recipesShared: 2,
    favorites: ["recipe_charred_broccolini"],
  },
];

const DEFAULT_RECIPES = [
  {
    _id: "recipe_honey_chili_salmon",
    title: "Honey-Chili Glazed Salmon",
    summary: "Seared salmon with a glossy honey-chili lacquer, finished with lime and fresh herbs.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    cuisineType: "Mediterranean",
    dietType: "Non-Veg",
    category: "Dinner",
    categoryTags: ["Seafood", "Gluten-free", "Weeknight"],
    cookingTime: 30,
    createdAt: "2024-03-18T18:32:00.000Z",
    createdBy: { id: "user_ayesha", name: "Ayesha Patel" },
    ingredients: [
      "4 salmon fillets",
      "3 tbsp honey",
      "2 tbsp chili paste",
      "1 lime, juiced",
      "1 tbsp soy sauce",
      "2 cloves garlic, minced",
      "Fresh cilantro for garnish",
    ],
    steps: [
      "Pat the salmon dry and season with salt.",
      "Whisk together honey, chili paste, lime juice, soy sauce, and garlic.",
      "Sear salmon skin-side down until crisp, then flip and glaze with sauce.",
      "Finish in the oven for 4 minutes until caramelised.",
      "Spoon over remaining glaze and top with cilantro.",
    ],
    avgRating: 4.8,
    bookmarksCount: 22,
    reviews: [
      {
        _id: "review_001",
        userId: "user_mateo",
        rating: 5,
        comment: "Perfect balance of sweet heat. Family favourite!",
        createdAt: "2024-04-01T12:00:00.000Z",
      },
      {
        _id: "review_002",
        userId: "user_grace",
        rating: 4,
        comment: "Added toasted sesame seeds for crunch—delicious.",
        createdAt: "2024-05-09T10:12:00.000Z",
      },
    ],
  },
  {
    _id: "recipe_smoky_eggplant_shakshuka",
    title: "Smoky Eggplant Shakshuka",
    summary: "Charred eggplant folded into a rich tomato base with soft-poached eggs and herb oil.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    cuisineType: "Middle Eastern",
    dietType: "Veg",
    category: "Brunch",
    categoryTags: ["One-pan", "Comfort", "Vegetarian"],
    cookingTime: 35,
    createdAt: "2024-02-10T09:15:00.000Z",
    createdBy: { id: "user_grace", name: "Grace Chen" },
    ingredients: [
      "2 medium eggplants",
      "1 onion, diced",
      "3 cloves garlic",
      "1 tsp smoked paprika",
      "1 tsp cumin seeds",
      "1 can crushed tomatoes",
      "4 eggs",
      "Parsley and dill for garnish",
    ],
    steps: [
      "Char eggplants over open flame until smoky and tender, then dice.",
      "Sauté onion and garlic with cumin seeds and paprika until fragrant.",
      "Stir in tomatoes and simmer 10 minutes.",
      "Fold in eggplant, make four wells, and crack eggs into each.",
      "Cover and cook until whites are set. Finish with herb oil.",
    ],
    avgRating: 4.5,
    bookmarksCount: 15,
    reviews: [
      {
        _id: "review_003",
        userId: "user_ayesha",
        rating: 5,
        comment: "Smoky depth is incredible. Served with za'atar flatbread!",
        createdAt: "2024-02-18T08:42:00.000Z",
      },
    ],
  },
  {
    _id: "recipe_matcha_tiramisu",
    title: "Matcha Cloud Tiramisu",
    summary: "Airy matcha mascarpone layered with citrus-soaked ladyfingers and white chocolate dust.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    cuisineType: "Fusion",
    dietType: "Veg",
    category: "Dessert",
    categoryTags: ["No-bake", "Tea", "Make-ahead"],
    cookingTime: 25,
    createdAt: "2024-01-22T16:20:00.000Z",
    createdBy: { id: "user_mateo", name: "Mateo Rossi" },
    ingredients: [
      "200 g ladyfingers",
      "2 tbsp matcha powder",
      "250 g mascarpone",
      "200 ml whipping cream",
      "1 orange, zested and juiced",
      "60 g sugar",
      "White chocolate curls",
    ],
    steps: [
      "Whip cream with sugar to soft peaks.",
      "Fold in mascarpone and matcha until smooth.",
      "Dip ladyfingers in orange juice and layer with matcha cream.",
      "Repeat layers, finishing with cream and white chocolate curls.",
      "Chill for at least 4 hours before slicing.",
    ],
    avgRating: 4.9,
    bookmarksCount: 28,
    reviews: [
      {
        _id: "review_004",
        userId: "user_grace",
        rating: 5,
        comment: "A showstopper dessert—light, creamy, and slightly earthy.",
        createdAt: "2024-03-05T11:33:00.000Z",
      },
    ],
  },
  {
    _id: "recipe_charred_broccolini",
    title: "Charred Broccolini with Tahini Drizzle",
    summary: "Smoky broccolini finished with a lemony tahini sauce, crispy chickpeas, and pomegranate.",
    imageUrl: "https://images.unsplash.com/photo-1477610201528-4b9144542727?auto=format&fit=crop&w=900&q=80",
    cuisineType: "Mediterranean",
    dietType: "Veg",
    category: "Sides",
    categoryTags: ["Vegetarian", "Quick", "Crowd-pleaser"],
    cookingTime: 20,
    createdAt: "2024-04-12T14:00:00.000Z",
    createdBy: { id: "user_grace", name: "Grace Chen" },
    ingredients: [
      "400 g broccolini",
      "2 tbsp olive oil",
      "1 tsp smoked paprika",
      "1 can chickpeas, roasted",
      "3 tbsp tahini",
      "1 lemon, juiced",
      "Pomegranate arils",
    ],
    steps: [
      "Toss broccolini in oil and paprika, then char on a hot grill pan.",
      "Whisk tahini with lemon juice, warm water, and salt until pourable.",
      "Plate broccolini with roasted chickpeas, drizzle with tahini, and finish with pomegranate.",
    ],
    avgRating: 4.6,
    bookmarksCount: 11,
    reviews: [
      {
        _id: "review_005",
        userId: "user_ayesha",
        rating: 4,
        comment: "Vibrant side! Added toasted almonds for crunch.",
        createdAt: "2024-04-20T17:02:00.000Z",
      },
    ],
  },
  {
    _id: "recipe_shrimp_tacos",
    title: "Citrus-Garlic Shrimp Tacos",
    summary: "Juicy shrimp with grapefruit slaw, avocado crema, and crispy shallots in warm tortillas.",
    imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
    cuisineType: "Latin American",
    dietType: "Non-Veg",
    category: "Dinner",
    categoryTags: ["Street food", "Quick", "Vibrant"],
    cookingTime: 25,
    createdAt: "2024-05-30T13:47:00.000Z",
    createdBy: { id: "user_mateo", name: "Mateo Rossi" },
    ingredients: [
      "400 g shrimp, peeled",
      "3 cloves garlic, minced",
      "1 grapefruit, juiced",
      "8 corn tortillas",
      "1 avocado",
      "½ cup sour cream",
      "Crispy shallots",
    ],
    steps: [
      "Marinate shrimp with garlic, grapefruit juice, and salt for 10 minutes.",
      "Blend avocado with sour cream, lime, and cilantro for crema.",
      "Sear shrimp until opaque and lightly charred.",
      "Warm tortillas, assemble with slaw, shrimp, crema, and crispy shallots.",
    ],
    avgRating: 4.7,
    bookmarksCount: 19,
    reviews: [
      {
        _id: "review_006",
        userId: "user_grace",
        rating: 5,
        comment: "Fresh and zesty—loved the grapefruit contrast!",
        createdAt: "2024-06-02T09:20:00.000Z",
      },
    ],
  },
];

const DEFAULT_HOME_CONTENT = {
  hero: [
    {
      _id: "hero_salmon",
      title: "Weeknight salmon, chef-level finish",
      subtitle: "Honey-chili glaze • 30 minutes",
      description: "Glaze, char, and finish with lime butter—your weekday table just levelled up.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      ctaHref: "/recipes/recipe_honey_chili_salmon",
      ctaLabel: "Cook the salmon",
      tag: "Editor’s pick",
      meta: {
        Cuisine: "Mediterranean",
        Difficulty: "Easy",
        Serves: "4",
      },
    },
    {
      _id: "hero_matcha",
      title: "Desserts that float above the table",
      subtitle: "Matcha tiramisu • No-bake delight",
      description: "Layered clouds of matcha mascarpone with citrus brightness for an effortless finish.",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      ctaHref: "/recipes/recipe_matcha_tiramisu",
      ctaLabel: "See the layers",
      tag: "Pastry studio",
      meta: {
        Focus: "No-bake",
        Prep: "25 mins",
        Serves: "6",
      },
    },
    {
      _id: "hero_tacos",
      title: "Street tacos with citrus swagger",
      subtitle: "Shrimp + grapefruit + avocado",
      description: "Sharp citrus, creamy avo, and a final crunch—crafted for warm evenings.",
      imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
      ctaHref: "/recipes/recipe_shrimp_tacos",
      ctaLabel: "Build tacos",
      tag: "Quick crowd-pleasers",
      meta: {
        Cuisine: "Latin American",
        Time: "25 mins",
        Serves: "4",
      },
    },
  ],
  collections: [
    {
      _id: "collection_flavour_trails",
      title: "Flavour trails",
      subtitle: "Mediterranean dinners",
      description: "Olive oil gloss, herb bouquets, and smoky citrus elements for relaxed evenings.",
      imageUrl: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_honey_chili_salmon",
      ctaLabel: "Explore dishes",
    },
    {
      _id: "collection_garden_bowls",
      title: "Garden bowls",
      subtitle: "Vegetable-forward plates",
      description: "Crisp greens, roasted roots, and silky sauces for effortlessly delicious veg dinners.",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_charred_broccolini",
      ctaLabel: "Get inspired",
    },
    {
      _id: "collection_sweet_balance",
      title: "Sweet balance",
      subtitle: "Tea-time finales",
      description: "Matcha, citrus, and chocolate assemble into airy desserts with elegant restraint.",
      imageUrl: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_matcha_tiramisu",
      ctaLabel: "Bake (no oven)",
    },
  ],
  quickPicks: [
    { title: "Dinner in 30", category: "Dinner" },
    { title: "Veg-forward", category: "Vegetarian" },
    { title: "Street food", category: "Street food" },
    { title: "Dessert studio", category: "Dessert" },
    { title: "Brunch club", category: "Brunch" },
    { title: "Gluten-free", category: "Gluten-free" },
  ],
  guides: [
    {
      _id: "guide_char",
      title: "Master the art of flame-kissed vegetables",
      description: "From blistered peppers to charred broccolini, balance smoke with brightness every time.",
      imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_charred_broccolini",
      ctaLabel: "See technique",
      meta: { readTime: "6 min read" },
    },
    {
      _id: "guide_matcha",
      title: "Matcha desserts without bitterness",
      description: "Build flavour layers with floral teas, citrus, and just enough sweetness.",
      imageUrl: "https://images.unsplash.com/photo-1529933037704-34c1b4c8e9c5?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_matcha_tiramisu",
      ctaLabel: "Blend it",
      meta: { readTime: "4 min read" },
    },
    {
      _id: "guide_taco",
      title: "Taco textures that pop",
      description: "Layer heat, acidity, crunch, and creaminess for tacos that wow on any night.",
      imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
      ctaHref: "/recipes/recipe_shrimp_tacos",
      ctaLabel: "Stack layers",
      meta: { readTime: "5 min read" },
    },
  ],
};

const DEFAULT_CONTRIBUTORS = [
  {
    _id: "user_ayesha",
    name: "Ayesha Patel",
    bio: "Culinary storyteller blending Gujarati roots with coastal produce.",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
    recipesShared: 4,
  },
  {
    _id: "user_mateo",
    name: "Mateo Rossi",
    bio: "Italian supper club host and hand-made pasta obsessive.",
    avatarUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&q=80",
    recipesShared: 3,
  },
  {
    _id: "user_grace",
    name: "Grace Chen",
    bio: "Weeknight meal prep coach helping cooks eat brilliantly.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    recipesShared: 2,
  },
];

const DEFAULT_EXTERNAL_RECIPES = [
  {
    id: "ext_herby_rigatoni",
    title: "Lemon-Herb Rigatoni",
    image: "https://images.unsplash.com/photo-1512058564366-c9e3ec356ef2?auto=format&fit=crop&w=900&q=80",
    cuisine: "Italian",
    category: "Pasta",
    instructions: [
      "Boil rigatoni until al dente.",
      "Sauté garlic in olive oil, add lemon zest and juice.",
      "Toss pasta with herb butter, parmesan, and toasted almonds.",
    ],
    ingredients: ["Rigatoni", "Garlic", "Parsley", "Basil", "Lemon", "Butter", "Parmesan"],
  },
  {
    id: "ext_spiced_dal",
    title: "Slow-Simmered Coconut Dal",
    image: "https://images.unsplash.com/photo-1478749485505-2a903a729c63?auto=format&fit=crop&w=900&q=80",
    cuisine: "Indian",
    category: "Lentils",
    instructions: [
      "Toast mustard seeds and curry leaves in coconut oil.",
      "Add lentils with tomatoes and simmer until creamy.",
      "Finish with coconut milk and lime juice.",
    ],
    ingredients: ["Red lentils", "Coconut milk", "Mustard seeds", "Curry leaves", "Tomatoes"],
  },
  {
    id: "ext_miso_soup",
    title: "Miso Mushroom Ramen",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416e?auto=format&fit=crop&w=900&q=80",
    cuisine: "Japanese",
    category: "Noodles",
    instructions: [
      "Simmer miso broth with kombu and shiitake.",
      "Sear mushrooms in sesame oil, add to broth.",
      "Serve with noodles, soft egg, and chilli oil.",
    ],
    ingredients: ["Miso paste", "Shiitake", "Kombu", "Sesame oil", "Ramen noodles", "Egg"],
  },
  {
    id: "ext_peri_chicken",
    title: "Peri-Peri Roast Chicken",
    image: "https://images.unsplash.com/photo-1514516430032-7d100ffb0074?auto=format&fit=crop&w=900&q=80",
    cuisine: "Portuguese",
    category: "Roast",
    instructions: [
      "Blend chillies, lemon, garlic, and herbs into peri-peri marinade.",
      "Spatchcock chicken and marinate overnight.",
      "Roast at high heat, basting with extra marinade.",
    ],
    ingredients: ["Whole chicken", "Bird's eye chillies", "Garlic", "Oregano", "Lemon", "Smoked paprika"],
  },
  {
    id: "ext_banh_mi",
    title: "Pickled Veg Bánh Mì",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=900&q=80",
    cuisine: "Vietnamese",
    category: "Sandwich",
    instructions: [
      "Pickle carrots and daikon with rice vinegar.",
      "Build sandwich with pâté, pickles, herbs, and chilli mayo.",
      "Serve on crisp baguette.",
    ],
    ingredients: ["Baguette", "Carrots", "Daikon", "Coriander", "Chilli mayo", "Pâté"],
  },
  {
    id: "ext_mango_sago",
    title: "Mango Sago Pudding",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    cuisine: "Asian",
    category: "Dessert",
    instructions: [
      "Cook sago pearls until translucent.",
      "Blend mango with coconut milk and condensed milk.",
      "Fold in sago and chill before serving with fresh mango.",
    ],
    ingredients: ["Mango", "Sago pearls", "Coconut milk", "Condensed milk", "Mint"],
  },
];

const DEFAULT_DB = {
  users: DEFAULT_USERS,
  recipes: DEFAULT_RECIPES,
  home: DEFAULT_HOME_CONTENT,
  contributors: DEFAULT_CONTRIBUTORS,
  external: DEFAULT_EXTERNAL_RECIPES,
  nextIds: {
    user: DEFAULT_USERS.length + 1,
    recipe: DEFAULT_RECIPES.length + 1,
    review: 100,
  },
};

const getStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
};

const ensureDb = () => {
  const storage = getStorage();
  const existing = storage.getItem(STORAGE_KEY);
  if (!existing) {
    storage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
  }
};

export const loadDb = () => {
  ensureDb();
  const storage = getStorage();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return clone(DEFAULT_DB);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    storage.removeItem(STORAGE_KEY);
    storage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
    return clone(DEFAULT_DB);
  }
};

export const saveDb = (db) => {
  const storage = getStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const resetDb = () => {
  const storage = getStorage();
  storage.removeItem(STORAGE_KEY);
  storage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
};

export const getDefaultDb = () => clone(DEFAULT_DB);

export const getExternalRecipes = () => clone(DEFAULT_EXTERNAL_RECIPES);

export const getStorageKey = () => STORAGE_KEY;
