import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";

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
    <div className="page page--center">
      <Form
        title="Create your Savora account"
        subtitle="Share recipes and connect with food lovers."
        onSubmit={handleSubmit}
        footer={
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        }
      >
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Priya Sharma" />
        </label>
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
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </Form>
    </div>
  );
};

export default RegisterPage;
