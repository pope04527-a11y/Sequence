import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/profileContext";
import CustomerServiceModal from "../components/CustomerServiceModal";

// Image Assets
import badgeIcon from "../assets/images/profile/badge.png";
import notifIcon from "../assets/images/profile/notif.png";

// Notification bell component
import NotificationBell from "../components/NotificationBell";

// ---- Updated: this Profile page no longer reads from localStorage synchronously.
// Instead it always fetches the authoritative profile on mount and when relevant events occur,
// so a previously cached user's data will not be shown to the current logged-in user. ----

const API_URL = "https://stacksapp-backend-main.onrender.com";
const START_BLUE = "#1fb6fc";
const END_BLUE = "#0072ff";

function GreyFadeMessage({ message, duration = 1000, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 20000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(245,247,251,0.93)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "#e6e6e6",
          color: "#222",
          borderRadius: "18px",
          padding: "1.2rem 2.5rem",
          fontWeight: 700,
          opacity: 0.96,
          fontSize: "1.18rem",
          boxShadow: "0 2px 16px 0 #0002",
          textAlign: "center",
          minWidth: "180px",
          letterSpacing: "0.01em",
          animation: "fade-in-out-profile-logout 1s linear",
        }}
      >
        {message}
      </div>
      <style>{`
        @keyframes fade-in-out-profile-logout {
          0% { opacity: 0; transform: scale(0.98);}
          10% { opacity: 1; transform: scale(1);}
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function LogoutModal({ open, onClose, onLogout }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.35)",
        minHeight: "100vh",
        minWidth: "100vw",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs mx-auto rounded-xl shadow-xl"
        style={{
          background: "#fff",
          pointerEvents: "auto",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "16px",
          boxShadow: "0 2px 16px 0 #0002",
          marginBottom: 0,
          maxWidth: 390,
          minWidth: 320,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-4">
          <span className="text-[18px] font-semibold text-[#222] mb-2">Logout</span>
          <span className="text-sm text-gray-700">Are you sure you want to logout?</span>
        </div>
        <div className="flex justify-between gap-6 mt-3">
          <button
            className="flex-1 py-2 rounded-full font-semibold text-base"
            style={{
              background: "#f2f2f2",
              color: "#222",
              border: "none",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded-full font-semibold text-base"
            style={{
              background: START_BLUE,
              color: "#fff",
              border: "none",
            }}
            onClick={onLogout}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function WithdrawPasswordModalProfile({
  open,
  onClose,
  onSubmit,
  withdrawPassword,
  setWithdrawPassword,
  errorMsg,
  submitting,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        minHeight: "100vh",
        minWidth: "100vw",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-xl shadow-xl"
        style={{
          background: "#fff",
          pointerEvents: "auto",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "18px",
          boxShadow: "0 2px 16px 0 #0002",
          maxWidth: 390,
          minWidth: 320,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <span className="text-[17px] font-semibold text-[#333]">Withdrawal Password</span>
          <button
            className="ml-2 rounded-full text-gray-400 px-1.5 py-1 transition hover:text-gray-700"
            onClick={onClose}
            style={{
              fontSize: "1.25rem",
              background: "#f2f2f2",
              border: "none",
              lineHeight: 1,
            }}
            aria-label="Cancel"
          >
            ×
          </button>
        </div>
        <input
          type="password"
          placeholder="Withdrawal Password"
          value={withdrawPassword}
          onChange={(e) => setWithdrawPassword(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-200 rounded outline-none text-base"
          disabled={submitting}
          autoFocus
          style={{ background: "#f6f7fb" }}
        />
        {errorMsg && <div className="text-red-500 text-sm mb-2">{errorMsg}</div>}
        <button
          onClick={onSubmit}
          className="w-full py-2 mt-1 rounded-full text-white font-semibold text-base"
          style={{
            background: START_BLUE,
            opacity: submitting ? 0.7 : 1,
            transition: "opacity 0.2s",
            boxShadow: `0 1px 8px ${START_BLUE}22`,
          }}
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile: contextProfile, fetchProfile } = useProfile();

  // NO localStorage fallback here — we intentionally avoid showing any cached previous user.
  // The page will always show the authoritative profile fetched on mount (or an error message)
  // so that a different previously-logged-in user's data does not flash.
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeMsg, setFadeMsg] = useState("");

  // Fetch authoritative profile on mount and whenever a 'profile:refresh' or 'balance:changed' event fires.
  const loadProfileNow = useCallback(async (timeoutMs = 4000) => {
    setLoading(true);
    try {
      // fetchProfile is provided by the ProfileProvider and will use the current auth token
      const user = await fetchProfile(null, timeoutMs);
      setProfile(user || null);
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;
    // Always fetch fresh profile on mount (do not rely on previously cached user)
    (async () => {
      await loadProfileNow(4000);
    })();

    function onProfileUpdated(e) {
      if (!mounted) return;
      if (e?.detail) setProfile(e.detail);
      else loadProfileNow().catch(() => {});
    }
    function onBalanceChanged() {
      if (!mounted) return;
      // quick refresh (debounced by provider)
      loadProfileNow().catch(() => {});
    }
    function onProfileRefresh() {
      if (!mounted) return;
      loadProfileNow().catch(() => {});
    }

    window.addEventListener("profile:updated", onProfileUpdated);
    window.addEventListener("balance:changed", onBalanceChanged);
    window.addEventListener("profile:refresh", onProfileRefresh);

    // also refresh when tab regains focus
    window.addEventListener("focus", onProfileRefresh);

    return () => {
      mounted = false;
      window.removeEventListener("profile:updated", onProfileUpdated);
      window.removeEventListener("balance:changed", onBalanceChanged);
      window.removeEventListener("profile:refresh", onProfileRefresh);
      window.removeEventListener("focus", onProfileRefresh);
    };
  }, [loadProfileNow]);

  // Handle protected route navigation (withdraw etc.)
  const handleProtectedRoute = (targetPath) => {
    setDestination(targetPath);
    setWithdrawPassword("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmitPassword = async () => {
    setErrorMsg("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/verify-withdraw-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ password: withdrawPassword }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        setShowModal(false);
        // Refresh authoritative profile then navigate
        await loadProfileNow();
        if (destination) navigate(destination);
      } else {
        setErrorMsg(data.message || "Incorrect withdrawal password.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setFadeMsg("Logout Success");
    setTimeout(() => {
      setFadeMsg("");
      // Clear tokens and profile from storage so next user won't see stale data
      try {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("profileFetchedAt");
      } catch (e) {}
      // notify other parts
      try { window.dispatchEvent(new Event("profile:refresh")); } catch (e) {}
      navigate("/login");
    }, 800);
  };

  // While loading, show a spinner so we do not display stale info
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            border: "4px solid #e6eef2",
            borderTop: `4px solid ${START_BLUE}`,
            borderRadius: "50%",
            width: 56,
            height: 56,
            animation: "spin 0.9s linear infinite"
          }} />
          <div style={{ color: "#333", fontWeight: 600 }}>Loading profile...</div>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-4" data-i18n="No profile found.">No profile found.</div>;
  }

  const username = profile.username || profile.fullName || "User";
  const vipLevel = profile.vipLevel ?? profile.vip ?? 1;
  const fullName = profile.fullName || username;
  const walletAddress = profile.walletAddress || "";

  const Row = ({ label, value, onEdit, editText = "Edit", showEdit = true }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{value}</div>
      </div>
      <div>
        {showEdit && (
          <button
            onClick={onEdit}
            style={{
              background: "transparent",
              border: "none",
              color: START_BLUE,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill={START_BLUE}/>
              <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill={START_BLUE}/>
            </svg>
            <span style={{ fontSize: 13 }}>{editText}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        background: "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
      }}
    >
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 80px", color: "#fff" }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ color: "#fff", fontSize: 32, margin: 0, fontWeight: 800 }}>Profile</h1>
        </div>

        <div style={{ height: 8, background: "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))", borderRadius: 4, marginBottom: 22 }} />

        <section
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.08))",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>Username</div>
                <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{username}</div>
              </div>
              <img src={badgeIcon} alt="Badge" style={{ width: 44, height: 44 }} />
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>Membership Tier</div>
              <div style={{ color: "#fff", fontWeight: 700 }}>{`VIP${vipLevel}`}</div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>Credibility</div>
              <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "#0ea5b7" }} />
              </div>
            </div>
          </div>

          <div>
            <Row label="Full Name" value={fullName} showEdit={false} />
            <Row label="Password" value={"••••••••"} onEdit={() => handleProtectedRoute("/update-password")} editText="Edit Password" />
            <Row label="Withdraw Password" value={"••••••••"} onEdit={() => handleProtectedRoute("/update-withdraw-password")} editText="Edit Password" />
            <Row label="Bind Wallet Address" value={walletAddress} onEdit={() => handleProtectedRoute("/bind-wallet")} editText="Edit Wallet Address" />
          </div>
        </section>
      </main>

      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onLogout={handleLogout} />

      <WithdrawPasswordModalProfile
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitPassword}
        withdrawPassword={withdrawPassword}
        setWithdrawPassword={setWithdrawPassword}
        errorMsg={errorMsg}
        submitting={submitting}
      />

      {fadeMsg && <GreyFadeMessage message={fadeMsg} duration={1000} onDone={() => setFadeMsg("")} />}

      <CustomerServiceModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}
