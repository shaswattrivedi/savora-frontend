import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { applyRecipeImageFallback, selectRecipeImage } from "../../utils/imageFallbacks.js";

const HomeHero = ({ slides = [], searchValue, onSearchChange, onSearchSubmit }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  if (!slides.length) {
    return null;
  }

  const activeSlide = slides[activeIndex];
  const heroTag = activeSlide.tag || "Editor's Pick";
  const description = activeSlide.description || activeSlide.subtitle || activeSlide.summary || "";
  const ctaHref = activeSlide.ctaHref || (activeSlide._id ? `/recipes/${activeSlide._id}` : "/recipes");
  const ctaLabel = activeSlide.ctaLabel || "View recipe";
  const heroImage = selectRecipeImage(
    [activeSlide.imageUrl, activeSlide.image, activeSlide.media?.imageUrl],
    {
      title: activeSlide.title,
      subtitle: activeSlide.subtitle,
      description,
      cuisine: activeSlide.cuisineType || activeSlide.meta?.Cuisine,
      category: activeSlide.category || activeSlide.meta?.Category,
      tags: activeSlide.tags,
      meta: activeSlide.meta,
    }
  );

  const showPrevSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="home-hero">
      <button
        type="button"
        className="home-hero__arrow home-hero__arrow--prev"
        onClick={showPrevSlide}
        aria-label="Previous hero slide"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div className="home-hero__content">
        <span className="home-hero__tag">{heroTag}</span>
        <h1 className="home-hero__title">{activeSlide.title}</h1>
        {activeSlide.subtitle && <p className="home-hero__subtitle">{activeSlide.subtitle}</p>}
        {description && <p className="home-hero__description">{description}</p>}

        <form className="home-hero__search" onSubmit={onSearchSubmit}>
          <label className="sr-only" htmlFor="home-hero-search">
            Search recipes
          </label>
          <input
            id="home-hero-search"
            type="search"
            placeholder="Search recipes, ingredients, or chefs"
            value={searchValue}
            onChange={onSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        <div className="home-hero__actions">
          <Link to={ctaHref} className="btn btn--primary">
            {ctaLabel}
          </Link>
          <Link to="/add" className="btn btn--secondary">
            Share a recipe
          </Link>
        </div>

      </div>

      <div className="home-hero__media">
        <img
          src={heroImage}
          alt={activeSlide.title}
          loading="lazy"
          onError={(event) =>
            applyRecipeImageFallback(event, {
              cuisine: activeSlide.cuisineType || activeSlide.meta?.Cuisine,
              category: activeSlide.category || activeSlide.meta?.Category,
              title: activeSlide.title,
            })
          }
        />
      </div>
      <button
        type="button"
        className="home-hero__arrow home-hero__arrow--next"
        onClick={showNextSlide}
        aria-label="Next hero slide"
      >
        <span aria-hidden="true">›</span>
      </button>
    </section>
  );
};

HomeHero.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      ctaLabel: PropTypes.string,
      ctaHref: PropTypes.string,
      meta: PropTypes.object,
      tag: PropTypes.string,
    })
  ).isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
};

HomeHero.defaultProps = {
  searchValue: "",
};

export default HomeHero;
