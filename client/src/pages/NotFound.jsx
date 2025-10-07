import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="page page--center">
    <section className="panel panel--glass not-found">
      <h1>404</h1>
      <p>We looked in every pantry and couldn't find that page.</p>
      <Link to="/" className="btn btn--primary">
        Back to recipes
      </Link>
    </section>
  </div>
);

export default NotFoundPage;
