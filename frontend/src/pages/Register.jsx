import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { registerUser } from "../services/auth";

import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError(
        "Please complete all fields."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirm_password
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );

      const data = err?.response?.data;

      if (data && typeof data === "object") {
        const firstError =
          Object.values(data)
            .flat()
            .find(
              (message) =>
                typeof message === "string"
            );

        setError(
          firstError ||
            "Unable to create your account."
        );
      } else {
        setError(
          "Unable to create your account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <Link
          to="/"
          className="auth-logo"
        >
          🎟 Tikiti<span>Hub</span>
        </Link>

        <div className="auth-header">

          <span className="section-label">
            JOIN TIKITIHUB
          </span>

          <h1>Create your account</h1>

          <p>
            Create an account and start
            booking unforgettable experiences.
          </p>

        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              autoComplete="username"
            />

          </div>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
            />

          </div>

          <div className="form-group">

            <label htmlFor="confirm_password">
              Confirm password
            </label>

            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={
                formData.confirm_password
              }
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account →"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

        <Link
          to="/events"
          className="auth-back"
        >
          ← Browse Events
        </Link>

      </div>

    </main>
  );
}

export default Register;