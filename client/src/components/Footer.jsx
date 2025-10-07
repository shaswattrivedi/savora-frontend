const Footer = () => (
  <footer className="footer">
    <div className="footer__content">
      <div>
        <h4>Savora</h4>
        <p>Trusted recipes, tested tips, and home cooks who love to share.</p>
      </div>
      <div className="footer__links">
        <a href="mailto:hello@savora.com">hello@savora.com</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noreferrer">
          Pinterest
        </a>
      </div>
    </div>
    <p className="footer__credit">© {new Date().getFullYear()} Savora Media. All rights reserved.</p>
  </footer>
);

export default Footer;
