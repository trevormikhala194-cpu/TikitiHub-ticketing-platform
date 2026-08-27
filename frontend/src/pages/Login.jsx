import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { loginUser } from "../services/auth";
import { saveAuth } from "../utils/auth";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      saveAuth(data);

      const destination =
        location.state?.from || "/";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);

      const responseData =
        err?.response?.data;

      let message =
        "Unable to login. Please check your credentials.";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData?.detail) {
        message = responseData.detail;
      } else if (responseData?.non_field_errors) {
        message =
          responseData.non_field_errors[0];
      }

      setError(message);
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
            WELCOME BACK
          </span>

          <h1>Login to TikitiHub</h1>

          <p>
            Sign in to book events and manage
            your tickets.
          </p>

        </div>

        {error && (
          <div className="auth-error">
            {error}
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
              placeholder="Enter your username"
              autoComplete="username"
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
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login →"}
          </button>

        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            Create one
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

export default Login;