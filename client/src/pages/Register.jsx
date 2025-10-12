import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import "../styles/auth.css";

const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      addToast("Welcome to Savora!", "success");
      navigate("/");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--center auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Create your Savora account</h1>
        <p className="auth-desc">Share recipes and connect with food lovers.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Priya Sharma"
              autoComplete="name"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              className="auth-input"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              className="auth-input"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              className="auth-input"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <footer className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </footer>
      </section>
    </div>
  );
};

export default RegisterPage;
