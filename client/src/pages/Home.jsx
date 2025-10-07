import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecipeFilters from "../components/RecipeFilters.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import HomeHero from "../components/home/HomeHero.jsx";
import HomeQuickPicks from "../components/home/HomeQuickPicks.jsx";
import HomeCollections from "../components/home/HomeCollections.jsx";
import HomeGuides from "../components/home/HomeGuides.jsx";
import { apiRequest } from "../utils/api.js";
import { useToast } from "../hooks/useToast.js";
import { searchExternalRecipes } from "../api/externalRecipes.js";

const initialFilters = {
  search: "",
  cuisine: "",
  diet: "",
  category: "",
  sort: "recent",
};

const DEFAULT_DISCOVER_QUERY = "a";

const transformExternalRecipe = (recipe) => ({
  _id: recipe.id,
  title: recipe.title,
  imageUrl: recipe.image,
  cuisineType: recipe.cuisine || recipe.category || "Global",
  summary: recipe.instructions?.[0] || "Imported from TheMealDB to inspire your next meal.",
  cookingTime: null,
  avgRating: null,
  createdBy: { name: "TheMealDB" },
  isExternal: true,
});

const createHeroSlidesFromExternal = (recipes) =>
  recipes.slice(0, 4).map((recipe) => {
    const subtitleParts = [recipe.cuisineType, recipe.category].filter(Boolean);
    const subtitle = subtitleParts.length ? subtitleParts.join(" • ") : "Curated by TheMealDB";
    return {
      _id: recipe._id,
      title: recipe.title,
      subtitle,
      description: recipe.summary,
      imageUrl: recipe.imageUrl,
      ctaHref: `/recipes/${recipe._id}`,
      ctaLabel: "View recipe",
      tag: recipe.cuisineType || "TheMealDB",
      meta: {
        Cuisine: recipe.cuisineType || "Global",
        Category: recipe.category || "Dish",
        Source: "Sourced via TheMealDB",
      },
    };
  });

const buildQuickPicksFromExternal = (recipes) => {
  const categories = Array.from(
    new Set(recipes.map((recipe) => recipe.category).filter(Boolean))
  );

  if (!categories.length) {
    return [];
  }

  return categories.slice(0, 6).map((category) => ({
    title: category,
    category,
  }));
};

const buildCollectionsFromExternal = (recipes) =>
  recipes.slice(0, 3).map((recipe) => ({
    _id: recipe._id,
    title: recipe.title,
    subtitle: recipe.cuisineType ? `${recipe.cuisineType} cuisine` : undefined,
    description: recipe.summary,
    imageUrl: recipe.imageUrl,
    ctaHref: `/recipes/${recipe._id}`,
    ctaLabel: "Explore recipe",
  }));

const buildGuidesFromExternal = (recipes) =>
  recipes.slice(3, 6).map((recipe) => ({
    _id: recipe._id,
    title: recipe.title,
    description: recipe.summary,
    imageUrl: recipe.imageUrl,
    ctaHref: `/recipes/${recipe._id}`,
    ctaLabel: "Cook this",
    meta: {
      readTime: recipe.cuisineType ? `${recipe.cuisineType} flair` : "Chef-tested",
    },
  }));

const HomePage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [recipes, setRecipes] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [homeContent, setHomeContent] = useState({
    hero: [],
    collections: [],
    quickPicks: [],
    guides: [],
  });
  const [contributors, setContributors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [usingExternal, setUsingExternal] = useState(false);
  const [externalMeta, setExternalMeta] = useState(null);
  const searchParamsKeyRef = useRef("");

  const loadRecipes = async (override = {}) => {
    setLoading(true);
    setExternalMeta(null);
    setUsingExternal(false);

    const mergedFilters = { ...filters, ...override };
    const nextPage = override.page ?? pagination.page ?? 1;
    const trimmedSearch = mergedFilters.search?.trim();
    const externalQuery = trimmedSearch || DEFAULT_DISCOVER_QUERY;

    const applyExternalResults = (externalResponse) => {
      const normalizedRecipes = externalResponse.recipes.map(transformExternalRecipe);
      const metaLabel = trimmedSearch || (externalResponse.usedFallback ? "trending picks" : externalResponse.query);

      setRecipes(normalizedRecipes);
      setPagination({ page: 1, totalPages: 1 });
      setUsingExternal(true);
      setExternalMeta({
        query: metaLabel,
        count: normalizedRecipes.length,
        mode: trimmedSearch ? "search" : "discover",
      });

      return { handled: true, hasResults: normalizedRecipes.length > 0 };
    };

    const applyExternalEmpty = () => {
      const metaLabel = trimmedSearch || "trending picks";
      setRecipes([]);
      setPagination({ page: 1, totalPages: 1 });
      setUsingExternal(true);
      setExternalMeta({
        query: metaLabel,
        count: 0,
        mode: trimmedSearch ? "search" : "discover",
      });

      return { handled: true, hasResults: false };
    };

    const tryExternal = async () => {
      try {
        const externalResponse = await searchExternalRecipes(externalQuery, {
          fallbackQuery: DEFAULT_DISCOVER_QUERY,
        });
        return applyExternalResults(externalResponse);
      } catch (externalError) {
        if (externalError.status === 404) {
          return applyExternalEmpty();
        }
        addToast(externalError.message, "error");
        return { handled: false, hasResults: false };
      }
    };

    const externalOutcome = await tryExternal();

    if (externalOutcome.handled) {
      if (externalOutcome.hasResults || trimmedSearch) {
        setLoading(false);
        return;
      }
      // If no results for discover mode, fall back to internal recipes below.
    }

    try {
      const response = await apiRequest("/recipes", {
        params: { ...mergedFilters, page: nextPage },
      });

      const fallbackPagination =
        response?.pagination && typeof response.pagination === "object"
          ? response.pagination
          : { page: nextPage, totalPages: pagination.totalPages || Math.max(1, nextPage) };

      const localRecipes = Array.isArray(response.recipes) ? response.recipes : [];

      setUsingExternal(false);
      setExternalMeta(null);
      setRecipes(localRecipes);
      setPagination(fallbackPagination);
    } catch (error) {
      addToast(error.message, "error");
      setUsingExternal(false);
      setExternalMeta(null);
      setRecipes([]);
      setPagination({ page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await apiRequest("/home");
        setHomeContent({
          hero: response.hero || [],
          collections: response.collections || [],
          quickPicks: response.quickPicks || [],
          guides: response.guides || [],
        });
      } catch (error) {
        // We keep the page functional even if the curated content fails.
      }
    };

    fetchHomeContent();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const trending = await apiRequest("/recipes/trending");
        setFeatured(trending.recipes);
      } catch (error) {
        // silently fail
      }
    };
    const fetchContributors = async () => {
      try {
        const response = await apiRequest("/users/top");
        setContributors(response.contributors);
      } catch (error) {
        // ignore
      }
    };

    fetchFeatured();
    fetchContributors();
  }, []);

  useEffect(() => {
    const paramsSignature = searchParams.toString();
    if (searchParamsKeyRef.current === paramsSignature) return;
    searchParamsKeyRef.current = paramsSignature;

    const nextFilters = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      cuisine: searchParams.get("cuisine") || "",
      diet: searchParams.get("diet") || "",
      sort: searchParams.get("sort") || "recent",
    };

    setFilters((prev) => ({ ...prev, ...nextFilters }));
    loadRecipes({ ...nextFilters, page: Number(searchParams.get("page")) || 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleQuickPick = (category) => {
    const normalizedCategory = category === filters.category ? "" : category;
    setFilters((prev) => ({ ...prev, category: normalizedCategory }));

    const previousSignature = searchParams.toString();
    const params = new URLSearchParams(searchParams);

    if (normalizedCategory) {
      params.set("category", normalizedCategory);
    } else {
      params.delete("category");
    }

    params.delete("page");
    const nextSignature = params.toString();
    navigate({ pathname: "/", search: nextSignature ? `?${nextSignature}` : "" }, { replace: true });

    if (nextSignature === previousSignature) {
      loadRecipes({
        page: 1,
        category: normalizedCategory,
        search: filters.search.trim(),
        cuisine: filters.cuisine,
        diet: filters.diet,
        sort: filters.sort,
      });
    }
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const trimmedSearch = filters.search.trim();
    setFilters((prev) => ({ ...prev, search: trimmedSearch }));
    const previousSignature = searchParams.toString();
    const params = new URLSearchParams(searchParams);
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    if (filters.category) {
      params.set("category", filters.category);
    } else {
      params.delete("category");
    }

    if (filters.cuisine) {
      params.set("cuisine", filters.cuisine);
    } else {
      params.delete("cuisine");
    }

    if (filters.diet) {
      params.set("diet", filters.diet);
    } else {
      params.delete("diet");
    }

    if (filters.sort && filters.sort !== "recent") {
      params.set("sort", filters.sort);
    } else {
      params.delete("sort");
    }

    params.delete("page");
    const nextSignature = params.toString();
    navigate({ pathname: "/", search: nextSignature ? `?${nextSignature}` : "" }, { replace: true });

    if (nextSignature === previousSignature) {
      loadRecipes({
        page: 1,
        search: trimmedSearch,
        category: filters.category,
        cuisine: filters.cuisine,
        diet: filters.diet,
        sort: filters.sort,
      });
    }
  };

  const totalPages = Math.max(1, pagination.totalPages || 0);

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    loadRecipes({ page: nextPage });
  };

  const heroSlides =
    usingExternal && recipes.length
      ? createHeroSlidesFromExternal(recipes)
      : homeContent.hero.length
        ? homeContent.hero
        : featured;

  const quickPickItems =
    usingExternal && recipes.length
      ? buildQuickPicksFromExternal(recipes)
      : homeContent.quickPicks;

  const collectionsData =
    usingExternal && recipes.length
      ? buildCollectionsFromExternal(recipes)
      : homeContent.collections;

  const guidesData =
    usingExternal && recipes.length
      ? buildGuidesFromExternal(recipes)
      : homeContent.guides;

  const trendingRecipes = usingExternal ? recipes.slice(0, 6) : featured;

  return (
    <div className="page home-layout">
      <HomeHero
        slides={heroSlides}
        searchValue={filters.search}
        onSearchChange={handleSearchInputChange}
        onSearchSubmit={handleFilterSubmit}
      />

      <HomeQuickPicks
        items={quickPickItems}
        activeCategory={filters.category}
        onPick={handleQuickPick}
      />

      <HomeCollections collections={collectionsData} />

      <section className="section home-trending">
        <div className="home-section__header">
          <h2 className="home-section__title">Trending recipes today</h2>
          <p className="home-section__subtitle">
            What Savora cooks are bookmarking and reviewing right now.
          </p>
        </div>
        {trendingRecipes.length ? (
          <div className="home-trending__list">
            {trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="empty-state">Trending picks will appear here soon.</div>
        )}
      </section>

      <section className="section">
        <div className="home-section__header">
          <h2 className="home-section__title">Latest from the community</h2>
          <p className="home-section__subtitle">
            Use filters to pinpoint exactly what you&apos;re craving or discover something new.
          </p>
        </div>
        <RecipeFilters filters={filters} onChange={handleFilterChange} onSubmit={handleFilterSubmit} />

        {usingExternal && !loading && (
          <div className="external-results-banner">
            <strong>TheMealDB recipes</strong>
            <span>
              {externalMeta?.mode === "discover"
                ? `Discovering ${externalMeta?.count || 0} featured dishes from TheMealDB.`
                : `Showing ${externalMeta?.count || 0} matches for "${externalMeta?.query}" from TheMealDB.`}
            </span>
          </div>
        )}

        {loading ? (
          <div className="loader">Loading recipes...</div>
        ) : (
          <RecipeGrid
            recipes={recipes}
            emptyMessage={
              usingExternal
                ? "No recipes found on Savora or TheMealDB yet. Try a different search."
                : undefined
            }
          />
        )}

        {!usingExternal && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn--light"
              disabled={pagination.page === 1}
              onClick={() => changePage(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn--light"
              disabled={pagination.page >= totalPages}
              onClick={() => changePage(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

  <HomeGuides guides={guidesData} />

      <section className="section home-contributors">
        <div className="home-section__header">
          <h2 className="home-section__title">Community spotlights</h2>
          <p className="home-section__subtitle">
            Meet the Savora members sharing their favourite recipes every week.
          </p>
        </div>
        <div className="home-contributors__list">
          {contributors.length ? (
            contributors.map((contributor) => (
              <article key={contributor._id} className="home-contributors__card">
                <img src={contributor.avatarUrl} alt={contributor.name} />
                <h3>{contributor.name}</h3>
                <p>{contributor.bio}</p>
                <span>{contributor.recipesShared} recipes shared</span>
              </article>
            ))
          ) : (
            <p className="empty-state">We&apos;re gathering shout-outs from top contributors.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
