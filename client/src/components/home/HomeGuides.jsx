import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { applyRecipeImageFallback, getRecipeFallbackImage } from "../../utils/imageFallbacks.js";

const HomeGuides = ({ guides = [] }) => {
  if (!guides.length) {
    return null;
  }

  return (
    <section className="section home-guides">
      <div className="home-section__header">
        <h2 className="home-section__title">In the Savora kitchen</h2>
      </div>
      <div className="home-guides__grid">
        {guides.map((guide) => (
          <article key={guide._id || guide.title} className="home-guides__card">
            <img
              src={
                guide.imageUrl ||
                getRecipeFallbackImage({
                  cuisine: guide.cuisine,
                  category: guide.category,
                  title: guide.title,
                })
              }
              alt={guide.title}
              loading="lazy"
              onError={(event) =>
                applyRecipeImageFallback(event, {
                  cuisine: guide.cuisine,
                  category: guide.category,
                  title: guide.title,
                })
              }
            />
            <div className="home-guides__content">
              <h4>{guide.title}</h4>
              {guide.description && <p>{guide.description}</p>}
              {guide.meta?.readTime && <span className="home-guides__meta">{guide.meta.readTime}</span>}
              {guide.ctaHref && (
                <Link to={guide.ctaHref} className="home-guides__cta">
                  {guide.ctaLabel || "See more"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

HomeGuides.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      imageUrl: PropTypes.string.isRequired,
      ctaLabel: PropTypes.string,
      ctaHref: PropTypes.string,
      meta: PropTypes.object,
    })
  ),
};

HomeGuides.defaultProps = {
  guides: [],
};

export default HomeGuides;
