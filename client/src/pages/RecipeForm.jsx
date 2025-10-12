import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import "../styles/recipeForm.css";

const emptyRecipe = {
  title: "",
  summary: "",
  ingredients: "",
  steps: "",
  cookingTime: 30,
  cuisineType: "Indian",
  dietType: "Veg",
  imageUrl: "",
  categoryTags: "",
};

const RecipeFormPage = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState(emptyRecipe);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      const loadRecipe = async () => {
        try {
          const response = await apiRequest(`/recipes/${id}`);
          const recipe = response.recipe;
          setForm({
            title: recipe.title,
            summary: recipe.summary,
            ingredients: recipe.ingredients.join("\n"),
            steps: recipe.steps.join("\n"),
            cookingTime: recipe.cookingTime,
            cuisineType: recipe.cuisineType,
            dietType: recipe.dietType,
            imageUrl: recipe.imageUrl,
            categoryTags: recipe.categoryTags.join(", "),
          });
        } catch (error) {
          addToast(error.message, "error");
        }
      };

      loadRecipe();
    }
  }, [mode, id, addToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "edit") {
        await apiRequest(`/recipes/${id}`, {
          method: "PUT",
          token,
          data: {
            ...form,
            ingredients: form.ingredients,
            steps: form.steps,
            categoryTags: form.categoryTags,
            cookingTime: Number(form.cookingTime),
          },
        });
        addToast("Recipe updated", "success");
        navigate(`/recipes/${id}`);
      } else {
        const response = await apiRequest("/recipes/create", {
          method: "POST",
          token,
          data: {
            ...form,
            cookingTime: Number(form.cookingTime),
          },
        });
        addToast("Recipe published", "success");
        navigate(`/recipes/${response.recipe._id}`);
      }
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--center recipe-form-page">
        <section className="recipe-form-card">
          <h1 className="recipe-form-title">{mode === "edit" ? "Edit recipe" : "Share a new recipe"}</h1>
          <p className="recipe-form-desc">Drop in your signature dish details and publish to the Savora table.</p>
          <form className="recipe-form" onSubmit={handleSubmit}>
            <label className="recipe-form-label" htmlFor="title">
              Title
              <input
                id="title"
                name="title"
                className="recipe-field"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="recipe-form-label" htmlFor="summary">
              Summary
              <textarea
                id="summary"
                name="summary"
                className="recipe-field recipe-field--textarea"
                placeholder="A short teaser for this dish"
                value={form.summary}
                onChange={handleChange}
                rows={3}
              />
            </label>

            <label className="recipe-form-label" htmlFor="ingredients">
              Ingredients
              <textarea
                id="ingredients"
                name="ingredients"
                className="recipe-field recipe-field--textarea"
                value={form.ingredients}
                onChange={handleChange}
                rows={6}
                placeholder="One ingredient per line"
                required
              />
            </label>

            <label className="recipe-form-label" htmlFor="steps">
              Steps
              <textarea
                id="steps"
                name="steps"
                className="recipe-field recipe-field--textarea"
                value={form.steps}
                onChange={handleChange}
                rows={6}
                placeholder="Describe each step on a new line"
                required
              />
            </label>

            <section className="recipe-form-grid">
              <label className="recipe-form-label" htmlFor="cookingTime">
                Cooking time (mins)
                <input
                  id="cookingTime"
                  name="cookingTime"
                  className="recipe-field"
                  type="number"
                  min={1}
                  value={form.cookingTime}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="recipe-form-label" htmlFor="cuisineType">
                Cuisine
                <select
                  id="cuisineType"
                  name="cuisineType"
                  className="recipe-field recipe-field--select"
                  value={form.cuisineType}
                  onChange={handleChange}
                >
                  <option>Indian</option>
                  <option>Italian</option>
                  <option>Asian</option>
                  <option>Continental</option>
                  <option>Desserts</option>
                  <option>Middle Eastern</option>
                  <option>International</option>
                </select>
              </label>
              <label className="recipe-form-label" htmlFor="dietType">
                Diet
                <select
                  id="dietType"
                  name="dietType"
                  className="recipe-field recipe-field--select"
                  value={form.dietType}
                  onChange={handleChange}
                >
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Vegan</option>
                </select>
              </label>
              <label className="recipe-form-label" htmlFor="categoryTags">
                Category tags
                <input
                  id="categoryTags"
                  name="categoryTags"
                  className="recipe-field"
                  value={form.categoryTags}
                  onChange={handleChange}
                  placeholder="Desserts, Weeknight, Family"
                />
              </label>
            </section>

            <label className="recipe-form-label" htmlFor="imageUrl">
              Image URL
              <input
                id="imageUrl"
                name="imageUrl"
                className="recipe-field"
                type="url"
                placeholder="https://"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="btn btn--primary recipe-form-submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Update recipe" : "Publish recipe"}
            </button>
          </form>
        </section>
    </div>
  );
};

RecipeFormPage.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
};

export default RecipeFormPage;
