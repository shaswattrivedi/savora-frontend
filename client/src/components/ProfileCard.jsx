import PropTypes from "prop-types";

const PROFILE_HIGHLIGHTS = (
  user,
  memberSinceLabel
) => [
  {
    key: "recipes",
    icon: "📖",
    metric: user.recipesShared ?? user.recipesCount ?? 0,
    title: "Recipes shared",
    description: "Original dishes you’ve brought to Savora’s table.",
  },
  {
    key: "favorites",
    icon: "💖",
    metric: user.favorites?.length || 0,
    title: "Saved favourites",
    description: "Treasured recipes you can revisit anytime.",
  },
  {
    key: "member",
    icon: "🗓️",
    metric: memberSinceLabel,
    title: "Member since",
    description: "A reminder of when you first joined our cookroom.",
  },
];

const ProfileCard = ({ user, onEdit }) => {
  const memberSinceLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "—";

  const highlights = PROFILE_HIGHLIGHTS(user, memberSinceLabel);

  return (
    <section className="panel profile-overview">
      <header className="profile-overview__header">
        <div className="profile-overview__identity">
          <div className="profile-overview__avatar">
            <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
          </div>
          <div className="profile-overview__text">
            <h1>{user.name}</h1>
            <p>{user.bio || "Share a little about your food journey."}</p>
            <button type="button" className="btn btn--light profile-overview__edit" onClick={onEdit}>
              Edit profile
            </button>
          </div>
        </div>
        <p className="profile-overview__intro">
          Craft collections, bookmark favourites, and follow your own flavour north star. Here’s a snapshot of your Savora
          story so far.
        </p>
      </header>

      <div className="profile-overview__grid">
        {highlights.map((highlight) => (
          <article key={highlight.key} className="profile-overview__card">
            <span className="profile-overview__icon" aria-hidden="true">
              {highlight.icon}
            </span>
            <strong className="profile-overview__metric">{highlight.metric}</strong>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

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
