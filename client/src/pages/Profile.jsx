import { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import Tabs from "../components/Tabs.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import Modal from "../components/Modal.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { apiRequest } from "../utils/api.js";

const ProfilePage = () => {
  const { user, token, refreshProfile, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(user);
  const [myRecipes, setMyRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("recipes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatarUrl: "" });

  useEffect(() => {
    const loadProfile = async () => {
      const data = await refreshProfile();
      if (data) {
        setProfile(data);
        setEditForm({ name: data.name, bio: data.bio || "", avatarUrl: data.avatarUrl });
      }
    };

    const loadMyRecipes = async () => {
      try {
        const response = await apiRequest("/recipes/mine", { token });
        setMyRecipes(response.recipes);
      } catch (error) {
        addToast(error.message, "error");
      }
    };

    loadProfile();
    loadMyRecipes();
  }, [token, refreshProfile, addToast]);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      const updated = await updateProfile(editForm);
      setProfile(updated);
      addToast("Profile updated", "success");
      setIsModalOpen(false);
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="page page--slim">
      <ProfileCard user={profile} onEdit={() => setIsModalOpen(true)} />

      <Tabs
        tabs={[
          { value: "recipes", label: "My Recipes" },
          { value: "favorites", label: "Favorites" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "recipes" ? (
        <RecipeGrid recipes={myRecipes} />
      ) : (
        <RecipeGrid recipes={profile.favorites || []} />
      )}

      <Modal open={isModalOpen} title="Edit profile" onClose={() => setIsModalOpen(false)}>
        <form className="profile-form" onSubmit={handleProfileSave}>
          <label>
            Name
            <input name="name" value={editForm.name} onChange={handleEditChange} required />
          </label>
          <label>
            Bio
            <textarea name="bio" value={editForm.bio} onChange={handleEditChange} rows={3} />
          </label>
          <label>
            Avatar URL
            <input name="avatarUrl" type="url" value={editForm.avatarUrl} onChange={handleEditChange} />
          </label>
          <button type="submit" className="btn btn--primary">
            Save changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
