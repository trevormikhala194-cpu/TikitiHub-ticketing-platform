import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  requestOTP,
  verifyOTP,
} from "../services/auth";

import { saveAuth } from "../utils/auth";

import "./Login.css";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [step, setStep] = useState(1);

  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [developmentOTP, setDevelopmentOTP] =
    useState("");


  // =========================
  // REQUEST LOGIN OTP
  // =========================

  const handleRequestOTP = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setDevelopmentOTP("");

    const value = identifier.trim();

    if (!value) {
      setError(
        "Please enter your email or phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await requestOTP(
        value,
        "LOGIN"
      );

      setIdentifier(data.identifier);

      setDevelopmentOTP(
        data.development_otp || ""
      );

      setMessage(
        "OTP sent successfully. Check your email or phone."
      );

      setStep(2);

    } catch (err) {
      console.error(
        "Failed to request login OTP:",
        err
      );

      const responseData =
        err?.response?.data;

      if (responseData?.identifier) {
        const identifierError =
          responseData.identifier;

        setError(
          Array.isArray(identifierError)
            ? identifierError[0]
            : identifierError
        );

      } else if (responseData?.detail) {
        setError(responseData.detail);

      } else {
        setError(
          "Unable to send OTP. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // VERIFY LOGIN OTP
  // =========================

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const code = otpCode.trim();

    if (!code) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError(
        "OTP must contain exactly 6 digits."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOTP(
        identifier,
        code,
        "LOGIN"
      );

      // =========================
      // SAVE AUTHENTICATION
      // =========================

      saveAuth(data);

      // =========================
      // UPDATE GLOBAL AUTH STATE
      // =========================

      login(data);

      setMessage(
        "Login successful!"
      );

      // =========================
      // REDIRECT
      // =========================

      const destination =
        location.state?.from || "/";

      setTimeout(() => {
        navigate(destination, {
          replace: true,
        });
      }, 500);

    } catch (err) {
      console.error(
        "Failed to verify login OTP:",
        err
      );

      const responseData =
        err?.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);

      } else if (responseData?.otp_code) {
        const otpError =
          responseData.otp_code;

        setError(
          Array.isArray(otpError)
            ? otpError[0]
            : otpError
        );

      } else {
        setError(
          "Unable to verify OTP. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // CHANGE EMAIL / PHONE
  // =========================

  const handleChangeIdentifier = () => {
    setStep(1);
    setOtpCode("");
    setError("");
    setMessage("");
    setDevelopmentOTP("");
  };


  return (
    <main className="auth-page">

      <div className="auth-card">

        {/* =========================
            BRAND
        ========================== */}

        <Link
          to="/"
          className="auth-logo"
        >
          🎟 Tikiti<span>Hub</span>
        </Link>


        {/* =========================
            STEP 1
        ========================== */}

        {step === 1 && (
          <>

            <div className="auth-header">

              <span className="section-label">
                WELCOME BACK
              </span>

              <h1>
                Login to TikitiHub
              </h1>

              <p>
                Enter your email address or
                phone number to continue.
              </p>

            </div>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <form
              className="auth-form"
              onSubmit={handleRequestOTP}
            >

              <div className="form-group">

                <label htmlFor="identifier">
                  Email or phone number
                </label>

                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(
                      event.target.value
                    )
                  }
                  placeholder="Email or phone number"
                  autoComplete="username"
                  disabled={loading}
                />

              </div>


              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Continue →"}
              </button>

            </form>


            <p className="auth-switch">

              Don't have an account?{" "}

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

          </>
        )}


        {/* =========================
            STEP 2
        ========================== */}

        {step === 2 && (
          <>

            <div className="auth-header">

              <span className="section-label">
                VERIFY LOGIN
              </span>

              <h1>
                Enter your OTP
              </h1>

              <p>
                Enter the 6-digit code sent to:
              </p>

              <strong className="auth-identifier">
                {identifier}
              </strong>

            </div>


            <form
              className="auth-form"
              onSubmit={handleVerifyOTP}
            >

              <div className="form-group">

                <label htmlFor="otp">
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(event) =>
                    setOtpCode(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="000000"
                  autoComplete="one-time-code"
                  disabled={loading}
                />

              </div>


              {message && (
                <div className="auth-success">
                  {message}
                </div>
              )}


              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              {/* DEVELOPMENT ONLY */}

              {developmentOTP && (
                <div className="development-otp">

                  <span>
                    Development OTP
                  </span>

                  <strong>
                    {developmentOTP}
                  </strong>

                </div>
              )}


              <button
                type="submit"
                className="auth-submit"
                disabled={
                  loading ||
                  otpCode.length !== 6
                }
              >
                {loading
                  ? "Verifying..."
                  : "Verify & Login"}
              </button>

            </form>


            <div className="otp-actions">

              <button
                type="button"
                onClick={
                  handleChangeIdentifier
                }
                disabled={loading}
              >
                ← Change email/phone
              </button>

            </div>


            <p className="auth-switch">

              Don't have an account?{" "}

              <Link to="/register">
                Create one
              </Link>

            </p>

          </>
        )}

      </div>

    </main>
  );
}


export default Login;