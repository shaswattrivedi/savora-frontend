import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import "../styles/auth.css";

const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      addToast("Welcome back to Savora", "success");
      navigate(from, { replace: true });
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--center auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Log in to Savora</h1>
        <p className="auth-desc">Discover recipes tailored to your tastes.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="auth-input"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="auth-input"
              required
              minLength={6}
              placeholder="Your secret"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-links">
          <button type="button" className="link-button">Forgot password?</button>
        </div>
        <footer className="auth-footer">
          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </footer>
      </section>
    </div>
  );
};

export default LoginPage;
