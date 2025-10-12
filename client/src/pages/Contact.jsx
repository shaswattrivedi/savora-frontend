import { useState } from "react";
import { useToast } from "../hooks/useToast.js";
import "../styles/contact.css";

const ContactPage = () => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addToast("Thanks for reaching out! We'll respond soon.", "success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
  <div className="page page--center contact-page">
      <section className="contact-glass">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-desc">Have feedback, collaboration ideas, or questions? Send us a note below and we'll get back to you soon.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input-glass"
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-glass"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="input-glass"
            />
          </div>
          <button type="submit" className="btn btn--primary contact-btn">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
