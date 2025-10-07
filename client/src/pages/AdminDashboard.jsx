import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { apiRequest } from "../utils/api.js";

const AdminDashboard = () => {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const loadAdminData = async () => {
    try {
      const [statsResponse, usersResponse, recipesResponse] = await Promise.all([
        apiRequest("/admin/stats", { token }),
        apiRequest("/users", { token }),
        apiRequest("/admin/recipes", { token }),
      ]);
      setStats(statsResponse.stats);
      setUsers(usersResponse.users);
      setRecipes(recipesResponse.recipes);
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await apiRequest(`/recipes/${id}`, { method: "DELETE", token });
      addToast("Recipe removed", "success");
      loadAdminData();
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user and their recipes?")) return;
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE", token });
      addToast("User deleted", "success");
      loadAdminData();
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <div className="page admin">
      <h1>Admin dashboard</h1>

      {stats && (
        <section className="admin__stats">
          <article className="stat-card gradient-mint">
            <h3>Total users</h3>
            <strong>{stats.userCount}</strong>
          </article>
          <article className="stat-card gradient-dawn">
            <h3>Total recipes</h3>
            <strong>{stats.recipeCount}</strong>
          </article>
          {stats.popularRecipe && (
            <article className="stat-card gradient-coral">
              <h3>Most bookmarked</h3>
              <p>{stats.popularRecipe.title}</p>
              <small>{stats.popularRecipe.bookmarksCount} bookmarks · ★ {stats.popularRecipe.avgRating}</small>
            </article>
          )}
        </section>
      )}

      <section className="panel">
        <h2>Manage users</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Recipes shared</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.recipesShared}</td>
                  <td>
                    <button type="button" className="link-button" onClick={() => deleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Moderate recipes</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Bookmarks</th>
                <th>Rating</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.createdBy?.name}</td>
                  <td>{recipe.bookmarksCount}</td>
                  <td>{recipe.avgRating}</td>
                  <td>
                    <button type="button" className="link-button" onClick={() => deleteRecipe(recipe._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
