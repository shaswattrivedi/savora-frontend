import PropTypes from "prop-types";

const RatingStars = ({ value = 0, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-stars">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`rating-stars__star ${value >= star ? "is-filled" : ""}`}
          onClick={() => onChange?.(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

RatingStars.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default RatingStars;
