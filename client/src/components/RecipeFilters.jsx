import PropTypes from "prop-types";

const cuisines = ["All", "Indian", "Italian", "Asian", "Continental", "Desserts", "Middle Eastern", "International"];
const diets = ["All", "Veg", "Non-Veg", "Vegan"];
const sorts = [
  { value: "recent", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Trending" },
];

const RecipeFilters = ({ filters, onChange, onSubmit }) => (
  <form className="filters" onSubmit={onSubmit}>
    <div className="filters__search">
      <label htmlFor="search" className="sr-only">
        Search recipes
      </label>
      <input
        id="search"
        name="search"
        type="search"
        placeholder="Search by name or ingredient"
        value={filters.search}
        onChange={onChange}
      />
      <button type="submit" className="btn btn--primary">
        Search
      </button>
    </div>

    <div className="filters__grid">
      <label>
        Cuisine
        <select name="cuisine" value={filters.cuisine} onChange={onChange}>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine === "All" ? "" : cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </label>
      <label>
        Diet
        <select name="diet" value={filters.diet} onChange={onChange}>
          {diets.map((diet) => (
            <option key={diet} value={diet === "All" ? "" : diet}>
              {diet}
            </option>
          ))}
        </select>
      </label>
      <label>
        Category
        <input
          name="category"
          placeholder="Desserts, Breakfast, ..."
          value={filters.category}
          onChange={onChange}
        />
      </label>
      <label>
        Sort by
        <select name="sort" value={filters.sort} onChange={onChange}>
          {sorts.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  </form>
);

RecipeFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    cuisine: PropTypes.string,
    diet: PropTypes.string,
    category: PropTypes.string,
    sort: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RecipeFilters;
