import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";
import "./Login.css";
import Footer from "../components/Footer.jsx"; // import shared Footer

// HEADER (identical to screenshot)
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

// FadeMessage overlay matches screenshot (centered, black, rounded)
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

// Spinner overlay (unchanged)
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

export default function Login({ refreshRecords }) {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [fadeMsg, setFadeMsg] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Store user information and token under the key 'token' so other parts of the app
        // (e.g. Tasks.jsx) can read it consistently.
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("user", data.user.username);
        localStorage.setItem("authToken", data.user.token);
        localStorage.setItem("token", data.user.token); // ensure compatibility with other modules
        setFadeMsg("Login Success");
        if (typeof refreshRecords === "function") {
          refreshRecords();
        }
      } else {
        setFadeMsg(data.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setFadeMsg("Server error. Please try again later.");
    }
  };

  React.useEffect(() => {
    if (fadeMsg === "Login Success") {
      const timer = setTimeout(() => {
        setFadeMsg("");
        setShowSpinner(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (fadeMsg && fadeMsg !== "Login Success") {
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
      <main className="login-main-content">
        <h1 className="login-welcome-title">WELCOME BACK</h1>
        <section className="login-form-section">
          <h2 className="login-form-title">Member Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-row">
              <label className="login-label">Username/Phone</label>
              <input
                name="username"
                type="text"
                className="login-input"
                placeholder="Username/Phone"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="login-input-row">
              <label className="login-label">Password</label>
              <input
                name="password"
                type="password"
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="login-form-footer">
              <Link to="/forgot" className="login-forgot-link">Forgot Password?</Link>
            </div>
            <button type="submit" className="login-btn">
              SIGN IN
            </button>
          </form>
          <div className="login-bottom-link">
            <span>Don't have an account? </span>
            <Link to="/register" className="login-link">Create an account</Link>
          </div>
        </section>
      </main>

      {/* Render shared Footer but disable all clickable elements on the footer for the login page
          except the floating chat button. We do this by wrapping Footer in a wrapper and injecting
          a small style which disables pointer-events for all descendants except .footer-chat-btn. */}
      <div className="login-footer-wrapper">
        <style>
          {`
            /* disable all interactions within the footer on the login page */
            .login-footer-wrapper .footer * {
              pointer-events: none !important;
            }
            /* enable interaction for the floating chat button and its children */
            .login-footer-wrapper .footer .footer-chat-btn,
            .login-footer-wrapper .footer .footer-chat-btn * {
              pointer-events: auto !important;
              cursor: pointer;
            }
            /* ensure the chat button remains above any overlay */
            .login-footer-wrapper .footer .footer-chat-btn {
              z-index: 9999;
            }
          `}
        </style>

        <Footer />
      </div>
    </div>
  );
}
