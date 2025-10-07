import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "../config/db.js";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
import { HomeFeature } from "../models/HomeFeature.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const editorialUserSeed = {
  name: "Savora Editorial",
  email: "editor@savora.com",
  password: "savora123",
  role: "admin",
  bio: "Curating seasonal favorites and trusted kitchen-tested recipes for the Savora community.",
  avatarUrl:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=240&q=80",
};

const recipeSeeds = [
  {
    title: "Caramelized Autumn Harvest Bake",
    summary: "Roasted squash, maple-glazed onions, and sage cream come together for the coziest casserole dinner.",
    imageUrl: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 55,
    cuisineType: "Continental",
    dietType: "Veg",
  categoryTags: ["Dinner", "Comfort", "Seasonal", "Veg"],
    ingredients: [
      "2 cups butternut squash, cubed",
      "1 large sweet onion, sliced",
      "2 tbsp maple syrup",
      "1 cup heavy cream",
      "2 tbsp chopped sage",
      "1 cup shredded gruyère",
      "Sea salt and cracked pepper",
    ],
    steps: [
      "Roast the squash and onions with olive oil, maple syrup, salt, and pepper for 25 minutes at 400°F.",
      "Whisk cream with sage and season. Toss roasted vegetables with cream mixture in a baking dish.",
      "Top with gruyère and bake for 20 minutes until bubbly and golden.",
    ],
    avgRating: 4.8,
    reviewCount: 128,
    bookmarksCount: 642,
  },
  {
    title: "Golden Herb Roast Chicken & Roots",
    summary: "Classic Sunday supper flavors with crispy skin and pan jus, served over honey-roasted root veggies.",
    imageUrl: "https://images.unsplash.com/photo-1588166756544-3c8c3b45ecaf?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 75,
    cuisineType: "International",
    dietType: "Non-Veg",
    categoryTags: ["Dinner", "One Pot", "Family"],
    ingredients: [
      "1 whole chicken (3-4 lbs)",
      "2 tbsp softened butter",
      "1 tbsp chopped rosemary",
      "1 tbsp chopped thyme",
      "1 lb baby carrots",
      "1 lb fingerling potatoes",
      "2 tbsp honey",
      "4 cloves garlic",
      "Sea salt and pepper",
    ],
    steps: [
      "Rub chicken with butter, herbs, salt, and pepper. Stuff cavity with garlic and extra herbs.",
      "Toss vegetables with olive oil, honey, salt, and pepper. Arrange in roasting pan and nestle chicken on top.",
      "Roast at 425°F for 60-70 minutes until juices run clear, basting halfway through.",
    ],
    avgRating: 4.9,
    reviewCount: 214,
    bookmarksCount: 1090,
  },
  {
    title: "Brown Butter Apple Skillet Cake",
    summary: "A one-pan dessert layered with caramelized apples, brown butter batter, and cinnamon sugar sparkle.",
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 50,
    cuisineType: "Desserts",
    dietType: "Veg",
    categoryTags: ["Dessert", "Seasonal", "Baking"],
    ingredients: [
      "1/2 cup unsalted butter",
      "3 honeycrisp apples, sliced",
      "1/2 cup brown sugar",
      "1 cup all-purpose flour",
      "1 tsp baking powder",
      "2 eggs",
      "1/3 cup granulated sugar",
      "1 tsp cinnamon",
      "1/2 tsp cardamom",
    ],
    steps: [
      "Brown the butter in a cast-iron skillet until nutty and fragrant.",
      "Caramelize apple slices with brown sugar in the butter, then remove half for topping.",
      "Whisk batter with remaining ingredients, pour over apples, top with reserved slices, and bake at 350°F for 25-28 minutes.",
    ],
    avgRating: 4.7,
    reviewCount: 189,
    bookmarksCount: 870,
  },
  {
    title: "Whipped Feta Harvest Board",
    summary: "Shareable appetizer packed with roasted grapes, rosemary pita, and silky whipped feta dip.",
    imageUrl: "https://images.unsplash.com/photo-1613478881569-4518c8de0a20?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 25,
    cuisineType: "Middle Eastern",
    dietType: "Veg",
  categoryTags: ["Appetizer", "Party", "Quick", "Veg"],
    ingredients: [
      "1 cup feta cheese",
      "1/2 cup Greek yogurt",
      "2 tbsp honey",
      "1 cup red grapes",
      "Fresh rosemary sprigs",
      "Warm pita wedges",
      "Olive oil, salt, pepper",
    ],
    steps: [
      "Roast grapes with rosemary, olive oil, and sea salt at 425°F for 10 minutes until blistered.",
      "Blend feta, yogurt, honey, and pepper until silky smooth.",
      "Serve whipped feta topped with warm grapes alongside toasted pita wedges.",
    ],
    avgRating: 4.6,
    reviewCount: 96,
    bookmarksCount: 540,
  },
  {
    title: "Maple-Pear Morning Oats",
    summary: "Cozy overnight oats layered with vanilla yogurt, spiced pears, and maple granola crunch.",
    imageUrl: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 10,
    cuisineType: "Continental",
    dietType: "Veg",
  categoryTags: ["Breakfast", "Healthy", "Quick", "Veg"],
    ingredients: [
      "1 cup rolled oats",
      "1 cup milk of choice",
      "1/2 cup vanilla yogurt",
      "1 ripe pear, diced",
      "2 tbsp maple syrup",
      "1/2 tsp cinnamon",
      "1/4 tsp nutmeg",
      "1/4 cup granola",
    ],
    steps: [
      "Stir oats with milk, half the yogurt, maple syrup, and spices. Refrigerate overnight.",
      "In the morning layer oats with remaining yogurt, spiced pears, and granola in jars.",
      "Finish with a drizzle of maple syrup and extra cinnamon if desired.",
    ],
    avgRating: 4.5,
    reviewCount: 72,
    bookmarksCount: 318,
  },
  {
    title: "Creamy Garlic Tuscan Shrimp",
    summary: "Seared shrimp in a sun-dried tomato cream sauce with wilted spinach and lemon zest.",
    imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    cookingTime: 30,
    cuisineType: "Italian",
    dietType: "Non-Veg",
    categoryTags: ["Dinner", "Weeknight", "Seafood"],
    ingredients: [
      "1 lb large shrimp, peeled",
      "2 tbsp butter",
      "4 cloves garlic, minced",
      "1/2 cup sun-dried tomatoes",
      "1 cup heavy cream",
      "2 cups baby spinach",
      "Zest of 1 lemon",
      "Fresh basil, salt, pepper",
    ],
    steps: [
      "Sear shrimp in butter until pink, then transfer to a plate.",
      "Sauté garlic and sun-dried tomatoes, pour in cream, and simmer until slightly thickened.",
      "Stir in spinach, basil, lemon zest, and return shrimp to coat in sauce. Serve over pasta or rice.",
    ],
    avgRating: 4.9,
    reviewCount: 256,
    bookmarksCount: 1314,
  },
];

const quickPickSeeds = [
  { title: "Family Dinner", category: "Dinner" },
  { title: "30-Minute Meals", category: "Quick" },
  { title: "Weekend Baking", category: "Dessert" },
  { title: "Healthy Starts", category: "Breakfast" },
  { title: "Game Day Bites", category: "Appetizer" },
  { title: "Veggie Comfort", category: "Veg" },
];

const seed = async () => {
  try {
    await connectDB();

    let editorialUser = await User.findOne({ email: editorialUserSeed.email });
    if (!editorialUser) {
      editorialUser = new User(editorialUserSeed);
      await editorialUser.save();
      console.log("👩‍🍳 Created editorial user");
    }

    const recipeMap = {};
    for (const recipeSeed of recipeSeeds) {
      const existing = await Recipe.findOne({ title: recipeSeed.title });
      if (existing) {
        Object.assign(existing, {
          ...recipeSeed,
          createdBy: editorialUser._id,
        });
        await existing.save();
        recipeMap[recipeSeed.title] = existing;
        console.log(`🔄 Updated recipe: ${recipeSeed.title}`);
      } else {
        const created = await Recipe.create({
          ...recipeSeed,
          createdBy: editorialUser._id,
        });
        recipeMap[recipeSeed.title] = created;
        console.log(`✨ Added recipe: ${recipeSeed.title}`);
      }
    }

    const collectionsSeeds = [
      {
        section: "collection",
        title: "Cozy Casseroles",
        subtitle: "Layered, bubbly, and crowd-friendly dinners",
        description: "From skillet bakes to stuffed shells, these casseroles warm the table in under an hour.",
        imageUrl: recipeMap["Caramelized Autumn Harvest Bake"].imageUrl,
        ctaLabel: "Browse casseroles",
        ctaHref: "/?category=Dinner",
        order: 1,
      },
      {
        section: "collection",
        title: "Sweet Weekend Projects",
        subtitle: "Bake something beautiful",
        description: "Pull-apart breads, brown butter cakes, and brunch bakes to share.",
        imageUrl: recipeMap["Brown Butter Apple Skillet Cake"].imageUrl,
        ctaLabel: "Plan a bake day",
        ctaHref: "/?category=Dessert",
        order: 2,
      },
      {
        section: "collection",
        title: "Supper in One Pan",
        subtitle: "Easy cleanup, big flavors",
        description: "Sheet-pan shrimp, roast chicken dinners, and skillet classics for busy weeknights.",
        imageUrl: recipeMap["Golden Herb Roast Chicken & Roots"].imageUrl,
        ctaLabel: "One-pan ideas",
        ctaHref: "/?category=Quick",
        order: 3,
      },
    ];

    const heroSeeds = [
      {
        section: "hero",
        tag: "Seasonal Spotlight",
        title: "Comfort cooking, curated for fall",
        subtitle: "Dinner tonight, dessert this weekend, and make-ahead breakfasts for cozy mornings.",
        description: "Start with our caramelized harvest bake, then explore casseroles, soups, and warming desserts handpicked by Savora editors.",
        imageUrl: recipeMap["Caramelized Autumn Harvest Bake"].imageUrl,
        ctaLabel: "Get the recipe",
        ctaHref: `/recipes/${recipeMap["Caramelized Autumn Harvest Bake"]._id}`,
        meta: { rating: "4.8 rating", reviews: "100+ reviews" },
        order: 1,
      },
      {
        section: "hero",
        tag: "Trending Now",
        title: "Tuscan shrimp in 30 minutes",
        subtitle: "Bright, creamy, and weeknight approved.",
        description: "Sun-dried tomatoes, garlic, and lemon come together for a skillet dinner that's ready faster than takeout.",
        imageUrl: recipeMap["Creamy Garlic Tuscan Shrimp"].imageUrl,
        ctaLabel: "Cook tonight",
        ctaHref: `/recipes/${recipeMap["Creamy Garlic Tuscan Shrimp"]._id}`,
        meta: { readyIn: "30 mins", favorites: "1.3k saves" },
        order: 2,
      },
      {
        section: "hero",
        tag: "Bake & Share",
        title: "Brown butter apple skillet cake",
        subtitle: "Serve warm with cardamom whipped cream.",
        description: "This one-pan dessert caramelizes in the oven while you brew the coffee.",
        imageUrl: recipeMap["Brown Butter Apple Skillet Cake"].imageUrl,
        ctaLabel: "Bake this weekend",
        ctaHref: `/recipes/${recipeMap["Brown Butter Apple Skillet Cake"]._id}`,
        meta: { serves: "Serves 6", prep: "15 min prep" },
        order: 3,
      },
    ];

    const guideSeeds = [
      {
        section: "guide",
        title: "How to build the ultimate fall grazing board",
        description: "Layer textures, seasonal fruit, and store-bought shortcuts for an effortless appetizer spread.",
        imageUrl: recipeMap["Whipped Feta Harvest Board"].imageUrl,
        ctaLabel: "Read the guide",
        ctaHref: `/recipes/${recipeMap["Whipped Feta Harvest Board"]._id}`,
        meta: { readTime: "5 min read" },
        order: 1,
      },
      {
        section: "guide",
        title: "Overnight oats three ways",
        description: "Make breakfast for the week with maple pears, espresso cocoa, and spiced berry swirls.",
        imageUrl: recipeMap["Maple-Pear Morning Oats"].imageUrl,
        ctaLabel: "Prep ahead",
        ctaHref: `/recipes/${recipeMap["Maple-Pear Morning Oats"]._id}`,
        meta: { readTime: "3 min read" },
        order: 2,
      },
    ];

    const quickPickFeatures = quickPickSeeds.map((item, index) => ({
      section: "quickPick",
      title: item.title,
      category: item.category,
      order: index + 1,
    }));

    const featureSeeds = [...heroSeeds, ...collectionsSeeds, ...guideSeeds, ...quickPickFeatures];

    for (const feature of featureSeeds) {
      await HomeFeature.findOneAndUpdate(
        { section: feature.section, title: feature.title },
        feature,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("✅ Home content seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed home content", error);
    process.exit(1);
  }
};

seed();