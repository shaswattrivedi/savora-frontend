import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard.jsx";
import Tabs from "../components/Tabs.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import Modal from "../components/Modal.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { apiRequest } from "../utils/api.js";

const ALLOWED_PROFILE_TABS = ["recipes", "favorites"];

const ProfilePage = () => {
  const { user, token, refreshProfile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [profile, setProfile] = useState(user);
  const [myRecipes, setMyRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatarUrl: "" });
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    return ALLOWED_PROFILE_TABS.includes(tabParam) ? tabParam : "recipes";
  });

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

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const nextTab = ALLOWED_PROFILE_TABS.includes(tabParam) ? tabParam : "recipes";
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (nextTab) => {
    const safeTab = ALLOWED_PROFILE_TABS.includes(nextTab) ? nextTab : "recipes";
    setActiveTab(safeTab);

    const params = new URLSearchParams(searchParams);
    if (safeTab === "recipes") {
      params.delete("tab");
    } else {
      params.set("tab", safeTab);
    }
    setSearchParams(params);
  };

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
        onChange={handleTabChange}
      />

      {activeTab === "recipes" ? (
        <RecipeGrid recipes={myRecipes} />
      ) : (
        <div id="favorites">
          <RecipeGrid recipes={profile.favorites || []} />
        </div>
      )}

      <Modal open={isModalOpen} title="Edit profile" onClose={() => setIsModalOpen(false)}>
        <p className="profile-form-desc">Refresh your name, bio, and avatar to keep your Savora profile feeling personal.</p>
        <form className="profile-form" onSubmit={handleProfileSave}>
          <div className="profile-form-group">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              name="name"
              className="profile-input"
              value={editForm.name}
              onChange={handleEditChange}
              required
              autoComplete="name"
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              name="bio"
              className="profile-input"
              value={editForm.bio}
              onChange={handleEditChange}
              rows={3}
              placeholder="Share a little about your food journey."
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="profile-avatar">Avatar URL</label>
            <input
              id="profile-avatar"
              name="avatarUrl"
              className="profile-input"
              type="url"
              value={editForm.avatarUrl}
              onChange={handleEditChange}
              placeholder="https://"
            />
          </div>
          <button type="submit" className="btn btn--primary profile-form-submit">
            Save changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
