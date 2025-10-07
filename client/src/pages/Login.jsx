import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";

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
    <div className="page page--center">
      <Form
        title="Log in to Savora"
        subtitle="Discover recipes tailored to your tastes."
        onSubmit={handleSubmit}
        footer={
          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        }
      >
        <label>
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Your secret"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button type="button" className="link-button">Forgot password?</button>
      </Form>
    </div>
  );
};

export default LoginPage;
