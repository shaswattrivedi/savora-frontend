import PropTypes from "prop-types";

const Form = ({ title, subtitle, children, footer, onSubmit }) => (
  <section className="form-shell gradient-mint">
    <div className="form-shell__header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <form className="form-shell__form" onSubmit={onSubmit}>
      {children}
    </form>
    {footer && <div className="form-shell__footer">{footer}</div>}
  </section>
);

Form.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  onSubmit: PropTypes.func,
};

export default Form;
