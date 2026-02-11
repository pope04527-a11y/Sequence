import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";
import "./Register.css";
import Footer from "../components/Footer.jsx"; // use shared Footer (same approach as Login.jsx)
import TermsAndConditions from "./TermsAndConditions.jsx"; // render standalone view on top of register

// HEADER (identical to Login page)
function Header() {
  return (
    <header className="header">
      <div className="header-bar">
        <img src={menuIcon} alt="Menu" className="header-icon" />
        <div className="header-logo-wrap">
          <img src={logo} alt="Sequence Logo" className="header-logo" />
          <span className="header-logo-text"></span>
        </div>
        <img src={refreshIcon} alt="Refresh" className="header-icon" />
      </div>
    </header>
  );
}

// FadeMessage overlay (centered, black, rounded)
function FadeMessage({ message, onDone, duration = 1200 }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);
  return (
    <div className="fade-message-center">
      <div className="fade-message-content">{message}</div>
      <style>
        {`
        .fade-message-center {
          position: fixed;
          left: 0; right: 0; top: 48%; z-index: 10000;
          display: flex; justify-content: center; pointer-events: none;
        }
        .fade-message-content {
          background: #181a1f;
          color: #fff;
          border-radius: 8px;
          padding: 0.7rem 2.2rem;
          font-weight: 600;
          font-size: 1.09rem;
          box-shadow: 0 2px 16px 0 #0003;
          text-align: center;
          min-width: 180px;
          max-width: 80vw;
          letter-spacing: 0.01em;
          opacity: 0.98;
          animation: fade-in-out-anim 1.2s linear;
        }
        @keyframes fade-in-out-anim {
          0% { opacity: 0; transform: scale(0.98);}
          10% { opacity: 1; transform: scale(1);}
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        `}
      </style>
    </div>
  );
}

// Spinner overlay
function SpinnerOverlay({ duration = 500, onDone }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(245,247,251,0.75)",
        pointerEvents: "none"
      }}
    >
      <div className="spinner" style={{
        width: 44, height: 44, border: "4px solid #ddd", borderTop: "4px solid #216378",
        borderRadius: "50%", animation: "spin 0.8s linear infinite"
      }} />
      <style>
        {`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}

const API_URL = "https://stacksapp-backend-main.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    withdrawalPassword: "",
    inviteCode: "",
    agreed: false,
  });
  const [fadeMsg, setFadeMsg] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  // Local state to show the standalone Terms & Conditions full-screen view
  const [termsStandaloneOpen, setTermsStandaloneOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.agreed) {
      setFadeMsg("Please agree to the Terms and Conditions.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFadeMsg("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          phone: form.phone,
          loginPassword: form.password,
          withdrawalPassword: form.withdrawalPassword,
          inviteCode: form.inviteCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFadeMsg("Register Success");
      } else {
        setFadeMsg(data.message || "Registration failed.");
      }
    } catch {
      setFadeMsg("Server error. Please try again later.");
    }
  };

  React.useEffect(() => {
    if (fadeMsg === "Register Success") {
      const timer = setTimeout(() => {
        setFadeMsg("");
        setShowSpinner(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (fadeMsg && fadeMsg !== "Register Success") {
      const timer = setTimeout(() => setFadeMsg(""), 1200);
      return () => clearTimeout(timer);
    }
  }, [fadeMsg]);

  React.useEffect(() => {
    if (showSpinner) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
        navigate("/dashboard");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSpinner, navigate]);

  return (
    <div className="login-bg-hero">
      <Header />
      {fadeMsg && <FadeMessage message={fadeMsg} />}
      {showSpinner && <SpinnerOverlay />}
      {/* Reduced spacing on main and section via inline styles so only this page is affected */}
      <main
        className="login-main-content"
        style={{
          paddingBottom: 0,
          marginBottom: 0,
        }}
      >
        <h1
          className="login-welcome-title"
          style={{
            marginBottom: "0.6rem", /* tighten space below title */
          }}
        >
          CREATE AN ACCOUNT
        </h1>
        <section
          className="login-form-section"
          style={{
            paddingBottom: "0.5rem",
            marginBottom: 0,
          }}
        >
          <h2
            className="login-form-title"
            style={{
              marginBottom: "0.4rem",
            }}
          >
            Your Account
          </h2>
          <div
            className="register-form-desc"
            style={{
              marginBottom: "0.3rem",
              paddingBottom: 0,
              lineHeight: 1.25,
            }}
          >
            Create your account to begin your journey with Sequenceopt.
          </div>
          <form
            className="login-form"
            onSubmit={handleRegister}
            style={{
              paddingBottom: "0.5rem",
              marginBottom: 0,
            }}
          >
            <div
              className="register-form-row"
              style={{ marginBottom: "0.5rem", paddingBottom: 0 }}
            >
              <div
                className="login-input-row"
                style={{ marginBottom: "0.4rem", paddingBottom: 0 }}
              >
                <label className="login-label">Username</label>
                <input
                  name="username"
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
              <div
                className="login-input-row"
                style={{ marginBottom: "0.4rem", paddingBottom: 0 }}
              >
                <label className="login-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  className="login-input"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div
              className="register-form-row"
              style={{ marginBottom: "0.5rem", paddingBottom: 0 }}
            >
              <div
                className="login-input-row"
                style={{ marginBottom: "0.4rem", paddingBottom: 0 }}
              >
                <label className="login-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div
                className="login-input-row"
                style={{ marginBottom: "0.4rem", paddingBottom: 0 }}
              >
                <label className="login-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="login-input"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div
              className="register-form-row"
              style={{ marginBottom: "0.4rem", paddingBottom: 0 }}
            >
              <div
                className="login-input-row"
                style={{ marginBottom: "0.35rem", paddingBottom: 0 }}
              >
                <label className="login-label">Withdrawal Password</label>
                <input
                  name="withdrawalPassword"
                  type="password"
                  className="login-input"
                  placeholder="Withdrawal Password"
                  value={form.withdrawalPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div
                className="login-input-row"
                style={{ marginBottom: "0.35rem", paddingBottom: 0 }}
              >
                <label className="login-label">Invite Code</label>
                <input
                  name="inviteCode"
                  type="text"
                  className="login-input"
                  placeholder="Invite Code"
                  value={form.inviteCode}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div
              className="register-checkbox-row"
              style={{ marginBottom: "0.5rem", paddingBottom: 0 }}
            >
              <input
                type="checkbox"
                className="register-checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                id="agreed"
              />
              <label htmlFor="agreed" className="register-checkbox-label">
                By registering, your account will be subject to the&nbsp;
                {/* Open Terms in a standalone full-screen view (no header/footer) */}
                <button
                  type="button"
                  className="login-link"
                  style={{ background: "none", border: "none", padding: 0, margin: 0, color: "inherit", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => setTermsStandaloneOpen(true)}
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="login-btn"
              style={{ marginBottom: "0.5rem" }}
            >
              SIGN UP
            </button>

            <div
              className="login-bottom-link"
              style={{ marginTop: "0.3rem", marginBottom: "0.25rem" }}
            >
              <span>Already have an account?</span> <Link to="/login" className="login-link">Sign in here</Link>
            </div>
          </form>
        </section>
      </main>

      {/* Render shared Footer but disable all clickable elements on the register page
          except the floating chat button. Also allow interaction for the customer service modal
          rendered inside the Footer by enabling pointer-events for [role="dialog"] so modal buttons
          are clickable and don't fall through to the page beneath.
          
          NOTE: added extra CSS rules scoped under .login-footer-wrapper to collapse the large
          footer block on the register page while keeping the small bottom bar and the floating
          chat button/modal accessible. This avoids editing the shared Footer component.
      */}
      <div
        className="login-footer-wrapper"
        style={{
          /* keep wrapper visible so footer elements that must show (chat button / copyright strip) remain */
          overflow: "visible",
        }}
      >
        <style>
          {`
            /* disable all interactions within the footer on the register page */
            .login-footer-wrapper .footer * {
              pointer-events: none !important;
            }

            /* enable interaction for the floating chat button and its children */
            .login-footer-wrapper .footer .footer-chat-btn,
            .login-footer-wrapper .footer .footer-chat-btn * {
              pointer-events: auto !important;
              cursor: pointer;
            }

            /* enable interaction for the customer service modal (mounted inside footer) */
            .login-footer-wrapper .footer [role="dialog"],
            .login-footer-wrapper .footer [role="dialog"] * {
              pointer-events: auto !important;
              cursor: auto;
            }

            /* ensure the chat button and modal overlay sit above other things */
            .login-footer-wrapper .footer .footer-chat-btn {
              z-index: 10001;
            }
            .login-footer-wrapper .footer [role="dialog"] {
              z-index: 10002;
            }

            /* ---------- Page-specific footer visual collapse ----------
               Hide the large mid/top parts of the footer on this page so the register
               card sits directly above the compact footer strip. We keep the bottom
               copyright/strip and the chat button/modal visible. */

            /* try to hide common footer sections by name (safe to use !important so it's page-scoped) */
            .login-footer-wrapper .footer .footer-top,
            .login-footer-wrapper .footer .footer-main,
            .login-footer-wrapper .footer .footer-content,
            .login-footer-wrapper .footer .footer-middle,
            .login-footer-wrapper .footer .footer-hero,
            .login-footer-wrapper .footer .footer-columns {
              display: none !important;
            }

            /* reduce padding and margins so the remaining footer strip is compact */
            .login-footer-wrapper .footer {
              padding-top: 0 !important;
              padding-bottom: 8px !important;
              margin: 0 !important;
              background: transparent !important;
            }

            /* ensure bottom copyright/stripe is visible (common class names) */
            .login-footer-wrapper .footer .footer-bottom,
            .login-footer-wrapper .footer .footer-bar,
            .login-footer-wrapper .footer .footer-copyright {
              display: block !important;
              pointer-events: auto !important; /* allow clicking links in the small bottom area if present */
            }

            /* safety: if footer uses generic sections, collapse any child that is tall */
            .login-footer-wrapper .footer > * {
              max-height: 160px;
              overflow: hidden;
            }
          `}
        </style>

        <Footer />
      </div>

      {/* Standalone Terms & Conditions full-screen view (no header/footer).
          This renders above everything and includes a Return button that closes it,
          returning the user to the register page. */}
      {termsStandaloneOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 11000,
            background: "linear-gradient(180deg,#071e2f 0%,#0b2b4a 100%)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Return strip at top (matches Layout's 'Return Home Page' strip style but without header) */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
            <div style={{ maxWidth: 1100, width: "100%", padding: "8px 16px", background: "transparent", borderRadius: 0, marginTop: 8, marginBottom: 8, boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setTermsStandaloneOpen(false)}
                  style={{ background: "transparent", border: "none", color: "#ffffff", opacity: 0.95, fontSize: 14, cursor: "pointer", padding: "6px 10px" }}
                  aria-label="Return to Register"
                >
                  Return Home Page &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Main Terms content area (render the existing TermsAndConditions component)
              We render it inside a centered container so it looks like the normal page content,
              but header/footer are not present. */}
          <div style={{ maxWidth: 1100, margin: "18px auto 40px", padding: "0 16px", background: "#fff", borderRadius: 6 }}>
            <TermsAndConditions />
          </div>
        </div>
      )}
    </div>
  );
}
