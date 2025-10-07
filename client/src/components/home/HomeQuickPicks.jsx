import PropTypes from "prop-types";

const HomeQuickPicks = ({ items = [], activeCategory, onPick }) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="section home-quick-picks">
      <div className="home-section__header">
        <h2 className="home-section__title">Quick picks for tonight</h2>
        <p className="home-section__subtitle">
          Tap a category to filter recipes or browse our editor-curated collections.
        </p>
      </div>
      <div className="home-quick-picks__list">
        {items.map((item) => (
          <button
            key={item._id || item.title}
            type="button"
            className={`home-quick-picks__item ${
              activeCategory && item.category === activeCategory ? "is-active" : ""
            }`}
            aria-pressed={item.category === activeCategory}
            onClick={() => onPick(item.category)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </section>
  );
};

HomeQuickPicks.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ),
  activeCategory: PropTypes.string,
  onPick: PropTypes.func.isRequired,
};

HomeQuickPicks.defaultProps = {
  items: [],
  activeCategory: "",
};

export default HomeQuickPicks;
