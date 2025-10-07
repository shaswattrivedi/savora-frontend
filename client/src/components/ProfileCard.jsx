import PropTypes from "prop-types";

const ProfileCard = ({ user, onEdit }) => (
  <section className="profile-card gradient-coral">
    <div className="profile-card__avatar">
      <img src={user.avatarUrl} alt={`${user.name} avatar`} />
    </div>
    <div className="profile-card__info">
      <h2>{user.name}</h2>
      <p>{user.bio || "Share a little about your food journey."}</p>
      <div className="profile-card__stats">
        <div>
          <span>{user.recipesShared ?? user.recipesCount ?? 0}</span>
          <small>Recipes</small>
        </div>
        <div>
          <span>{user.favorites?.length || 0}</span>
          <small>Bookmarks</small>
        </div>
        <div>
          <span>{user.createdAt ? new Date(user.createdAt).getFullYear() : "—"}</span>
          <small>Member since</small>
        </div>
      </div>
      <button type="button" className="btn btn--light" onClick={onEdit}>
        Edit profile
      </button>
    </div>
  </section>
);

ProfileCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string,
    avatarUrl: PropTypes.string,
    recipesShared: PropTypes.number,
    favorites: PropTypes.array,
    createdAt: PropTypes.string,
    recipesCount: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProfileCard;
