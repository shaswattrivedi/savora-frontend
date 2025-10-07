import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard.jsx";

const RecipeGrid = ({ recipes, emptyMessage = "No recipes match your filters yet.", onBookmarkToggle }) => {
  if (!recipes.length) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} onBookmarkToggle={onBookmarkToggle} />
      ))}
    </div>
  );
};

RecipeGrid.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string,
  onBookmarkToggle: PropTypes.func,
};

export default RecipeGrid;
