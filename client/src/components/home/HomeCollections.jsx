import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { applyRecipeImageFallback, getRecipeFallbackImage } from "../../utils/imageFallbacks.js";

const HomeCollections = ({ collections = [] }) => {
  if (!collections.length) {
    return null;
  }

  return (
    <section className="section home-collections">
      <div className="home-section__header">
        <h2 className="home-section__title">Featured collections</h2>
      </div>
      <div className="home-collections__grid">
        {collections.map((collection) => (
          <article key={collection._id || collection.title} className="home-collections__card">
            <img
              src={
                collection.imageUrl ||
                getRecipeFallbackImage({
                  cuisine: collection.subtitle?.replace(/ cuisine$/i, ""),
                  category: collection.category,
                  title: collection.title,
                })
              }
              alt={collection.title}
              loading="lazy"
              onError={(event) =>
                applyRecipeImageFallback(event, {
                  cuisine: collection.subtitle?.replace(/ cuisine$/i, ""),
                  category: collection.category,
                  title: collection.title,
                })
              }
            />
            <div className="home-collections__content">
              {collection.subtitle && (
                <span className="home-collections__eyebrow">{collection.subtitle}</span>
              )}
              <h3>{collection.title}</h3>
              {collection.ctaHref && (
                <Link to={collection.ctaHref} className="home-collections__cta">
                  {collection.ctaLabel || "Explore"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

HomeCollections.propTypes = {
  collections: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string.isRequired,
      ctaLabel: PropTypes.string,
      ctaHref: PropTypes.string,
    })
  ),
};

HomeCollections.defaultProps = {
  collections: [],
};

export default HomeCollections;
