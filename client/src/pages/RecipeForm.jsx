import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";

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
    <div className="page page--slim">
      <section className="panel panel--glass">
        <h1>{mode === "edit" ? "Edit recipe" : "Share a new recipe"}</h1>
        <form className="recipe-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Summary
            <textarea
              name="summary"
              placeholder="A short teaser for this dish"
              value={form.summary}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <label>
            Ingredients
            <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              rows={6}
              placeholder="One ingredient per line"
              required
            />
          </label>

          <label>
            Steps
            <textarea
              name="steps"
              value={form.steps}
              onChange={handleChange}
              rows={6}
              placeholder="Describe each step on a new line"
              required
            />
          </label>

          <section className="recipe-form__grid">
            <label>
              Cooking time (mins)
              <input
                name="cookingTime"
                type="number"
                min={1}
                value={form.cookingTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Cuisine
              <select name="cuisineType" value={form.cuisineType} onChange={handleChange}>
                <option>Indian</option>
                <option>Italian</option>
                <option>Asian</option>
                <option>Continental</option>
                <option>Desserts</option>
                <option>Middle Eastern</option>
                <option>International</option>
              </select>
            </label>
            <label>
              Diet
              <select name="dietType" value={form.dietType} onChange={handleChange}>
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Vegan</option>
              </select>
            </label>
            <label>
              Category tags
              <input
                name="categoryTags"
                value={form.categoryTags}
                onChange={handleChange}
                placeholder="Desserts, Weeknight, Family"
              />
            </label>
          </section>

          <label>
            Image URL
            <input
              name="imageUrl"
              type="url"
              placeholder="https://"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn btn--primary" disabled={loading}>
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
