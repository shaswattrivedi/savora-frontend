import PropTypes from "prop-types";

const Form = ({ title, subtitle, children, footer, onSubmit }) => (
  <section className="form-shell">
    <header className="form-shell__header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </header>
    <form className="form-shell__form" onSubmit={onSubmit}>
      {children}
    </form>
    {footer && <footer className="form-shell__footer">{footer}</footer>}
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
