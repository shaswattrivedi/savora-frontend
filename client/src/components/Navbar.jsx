import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import accountIcon from "../assets/account.png";

const navLinks = [
  { to: "/", label: "Discover" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const categoryLinks = [
  { label: "All Recipes", value: "" },
  { label: "Dinner", value: "Dinner" },
  { label: "Breakfast & Brunch", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Desserts", value: "Dessert" },
  { label: "Quick & Easy", value: "Quick" },
  { label: "Healthy", value: "Healthy" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  }, [location.search]);

  const handleLogout = useCallback(() => {
    logout();
    addToast("You have been logged out", "info");
    setIsMenuOpen(false);
    navigate("/");
  }, [logout, addToast, navigate, setIsMenuOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  const renderNavItems = () =>
    navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `navbar__link ${isActive ? "navbar__link--active" : ""}`
        }
        onClick={() => setIsMenuOpen(false)}
      >
        {link.label}
      </NavLink>
    ));

  const authLinks = useMemo(() => {
    if (user) {
      return (
        <>
          <NavLink to="/add" className="navbar__cta" onClick={() => setIsMenuOpen(false)}>
            Share a Recipe
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `navbar__link navbar__profile-link ${isActive ? "navbar__link--active" : ""}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={accountIcon} alt="" aria-hidden="true" className="navbar__profile-icon" />
            <span className="sr-only">My Space</span>
          </NavLink>
          {user.role === "admin" && (
            <NavLink to="/admin" className="navbar__link" onClick={() => setIsMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          <button type="button" className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <NavLink to="/login" className="navbar__link" onClick={() => setIsMenuOpen(false)}>
          Login
        </NavLink>
        <NavLink to="/register" className="navbar__cta" onClick={() => setIsMenuOpen(false)}>
          Join Savora
        </NavLink>
      </>
    );
  }, [handleLogout, setIsMenuOpen, user]);

  const updateSearchParams = (updater) => {
    const params = new URLSearchParams(location.search);
    updater(params);
    params.delete("page");
    const next = params.toString();
    navigate({ pathname: "/", search: next ? `?${next}` : "" });
    setIsMenuOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    updateSearchParams((params) => {
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
    });
  };

  const handleCategoryClick = (value) => {
    const nextValue = value === activeCategory ? "" : value;
    updateSearchParams((params) => {
      if (nextValue) {
        params.set("category", nextValue);
      } else {
        params.delete("category");
      }
    });
  };

  const renderSearchForm = (modifier = "") => (
    <form className={`navbar__search ${modifier}`} onSubmit={handleSearch}>
      <label className="sr-only" htmlFor={`navbar-search-${modifier || "desktop"}`}>
        Search recipes
      </label>
      <input
        id={`navbar-search-${modifier || "desktop"}`}
        type="search"
        placeholder="Search recipes, ingredients, or chefs"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );

  return (
    <header className="navbar">
      <div className="navbar__top">
        <div className="navbar__brand">
          <Link to="/">
            <span className="navbar__logo">Savora</span>
          </Link>
        </div>

        {renderSearchForm("navbar__search--desktop")}

        <div className="navbar__utilities">
          <nav className="navbar__links navbar__links--desktop">{renderNavItems()}</nav>
          <div className="navbar__auth navbar__auth--desktop">{authLinks}</div>
        </div>

        <button
          className="navbar__toggle"
          type="button"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>

      <div className={`navbar__bottom ${isMenuOpen ? "is-open" : ""}`}>
        {renderSearchForm("navbar__search--mobile")}
  <nav className="navbar__links navbar__links--mobile">{renderNavItems()}</nav>
        <div className="navbar__auth navbar__auth--mobile">{authLinks}</div>
      </div>

      <div className="navbar__categories">
        {categoryLinks.map((category) => (
          <button
            key={category.value}
            type="button"
            className={`navbar__category ${
              activeCategory === category.value ? "is-active" : ""
            }`}
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
