import { useState } from "react";
import { useToast } from "../hooks/useToast.js";

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
    <div className="page page--center">
      <section className="panel panel--glass contact-form">
        <h1>Contact us</h1>
        <p>Have feedback, collaboration ideas, or questions? Send us a note.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Send message
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
