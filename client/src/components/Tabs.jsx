import PropTypes from "prop-types";

const Tabs = ({ tabs, active, onChange }) => (
  <div className="tabs">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        className={`tabs__tab ${tab.value === active ? "is-active" : ""}`}
        onClick={() => onChange(tab.value)}
      >
        {tab.icon && <span className="tabs__icon" aria-hidden>{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
);

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Tabs;
