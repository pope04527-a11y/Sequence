import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";
import "./Login.css";
import CustomerServiceModal from "../components/CustomerServiceModal.jsx";


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

// FOOTER (identical to screenshot, but links disabled except Customer Service and Terms & Conditions)
function Footer() {
  const [csOpen, setCsOpen] = useState(false);

  const handleOpenCustomerService = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setCsOpen(true);
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }
  };

  // Reusable disabled link style to keep visual parity but disable interaction
  const disabledLinkStyle = {
    display: "block",
    color: "inherit",
    textDecoration: "none",
    marginBottom: "0.5rem",
    pointerEvents: "none",
    cursor: "default",
    opacity: 1,
  };

  const activeLinkStyle = {
    display: "block",
    fontSize: "0.9rem",
    textDecoration: "none",
    marginBottom: "0.5rem",
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-logo-row">
          <img src={logo} alt="Sequence Logo" className="footer-logo" />
          <span className="footer-logo-text">sequence</span>
        </div>
        <div className="footer-about">
          We are a leading marketing agency that utilizes over 10 years of proprietary data and insights, combined with a team of 70+ expert marketers.<br />
          Join over 4,000 marketers who receive weekly digital marketing tips tailored for industries like electronics, household goods, and many more.
        </div>
        <div className="footer-links-row" aria-label="Footer links">
          <div>
            <div className="footer-section-title">COMPANY</div>
            <span style={disabledLinkStyle}>About Us</span>
            <span style={disabledLinkStyle}>Join Us</span>
            <span style={disabledLinkStyle}>Contact Us</span>
            <span style={disabledLinkStyle}>Premium Membership</span>
            <span style={disabledLinkStyle}>Company Certificate</span>
          </div>
          <div>
            <div className="footer-section-title">INFORMATION</div>
            <span style={disabledLinkStyle}>Privacy Policy</span>
            {/* Terms & Conditions remains active */}
            <Link to="/TermsAndConditions" style={activeLinkStyle}>
              Terms and Conditions
            </Link>
            <span style={disabledLinkStyle}>FAQs</span>
            <span style={disabledLinkStyle}>Latest Events</span>
          </div>
        </div>
        <div className="footer-copyright-row">
          <span className="footer-copyright">
            <img src={logo} alt="Sequence Logo small" className="footer-logo-small" />
            &copy; 2025 - Sequence Commerce
          </span>
        </div>
      </div>

      {/* Floating chat button - active */}
      <a
        href="/customer-service"
        onClick={handleOpenCustomerService}
        className="footer-chat-btn"
        title="Customer Service"
        aria-label="Contact customer service"
        style={{ position: "fixed", right: 8, bottom: 60, width: 60, height: 60, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
      >
        <img src={chatIcon} alt="Chat Icon" />
      </a>

      {/* Local modal so chat works on login page without importing the shared Footer component */}
      <CustomerServiceModal open={csOpen} onClose={() => setCsOpen(false)} />
    </footer>
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
      <Footer />
    </div>
  );
}
