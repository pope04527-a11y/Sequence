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

const API_URL = "https://sequence-commerce-nsph.onrender.com";

export default function Login({ refreshRecords }) {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [fadeMsg, setFadeMsg] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  // helper: fetch profile and other user data immediately after login
  async function fetchAndCacheUserData(token) {
    if (!token) return null;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      // Fetch the main profile; other endpoints may depend on it
      const profileReq = fetch(`${API_URL}/api/user-profile`, { method: "GET", headers });
      // Optional: other data you might want eagerly: task-records, transactions
      const tasksReq = fetch(`${API_URL}/api/task-records`, { method: "GET", headers });
      const txReq = fetch(`${API_URL}/api/transactions`, { method: "GET", headers });

      // Run in parallel and ignore failures for non-critical endpoints
      const [profileRes, tasksRes, txRes] = await Promise.allSettled([profileReq, tasksReq, txReq]);

      let profile = null;
      if (profileRes.status === "fulfilled" && profileRes.value.ok) {
        try {
          const json = await profileRes.value.json();
          if (json && json.success && json.user) {
            profile = json.user;
            // Save main canonical user profile in localStorage
            localStorage.setItem("currentUser", JSON.stringify(profile));
            localStorage.setItem("user", profile.username || "");
            // Also keep token keys for compatibility across the app
            localStorage.setItem("authToken", token);
            localStorage.setItem("token", token);
          }
        } catch (e) {
          // ignore parse errors
          console.warn("Failed to parse profile response:", e);
        }
      }

      // tasks
      if (tasksRes.status === "fulfilled" && tasksRes.value.ok) {
        try {
          const json = await tasksRes.value.json();
          if (json && json.success && json.records) {
            localStorage.setItem("taskRecords", JSON.stringify(json.records));
          }
        } catch (e) { /* ignore */ }
      }

      // transactions
      if (txReq && txRes.status === "fulfilled" && txRes.value.ok) {
        try {
          const json = await txRes.value.json();
          if (json && json.success) {
            localStorage.setItem("transactions", JSON.stringify({ deposits: json.deposits, withdrawals: json.withdrawals }));
          }
        } catch (e) { /* ignore */ }
      }

      // notify other parts of the app
      if (profile) {
        try {
          window.dispatchEvent(new CustomEvent('userProfileLoaded', { detail: profile }));
        } catch (e) { /* ignore */ }
      }

      return profile;
    } catch (err) {
      console.warn("fetchAndCacheUserData error:", err);
      return null;
    }
  }

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
        // token can be returned either as data.token or data.user.token
        const token = data.token || (data.user && data.user.token) || (data.user && data.user?.token);

        // Save initial user object & token quickly so other sync code can read them
        if (data.user) {
          // store the raw user returned by login (may be partial)
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          localStorage.setItem("user", data.user.username || "");
        }
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("token", token);
        }

        setFadeMsg("Login Success");

        // Immediately fetch full user profile and other data before navigation,
        // so subsequent pages can read data from localStorage / receive the event.
        await fetchAndCacheUserData(token);

        // call parent refresh hook if provided
        if (typeof refreshRecords === "function") {
          try { refreshRecords(); } catch (e) { console.warn('refreshRecords failed', e); }
        }

        // show spinner then navigate
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
          except the floating chat button. Also allow interaction for the customer service modal
          rendered inside the Footer by enabling pointer-events for [role="dialog"] so modal buttons
          are clickable and don't fall through to the page beneath. */}
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
          `}
        </style>

        <Footer />
      </div>
    </div>
  );
}
