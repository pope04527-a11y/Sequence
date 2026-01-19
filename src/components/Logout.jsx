import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Logout.jsx
 *
 * - Renders a logout confirmation modal when the route is visited (modal opens automatically).
 * - If the user confirms, clears the username from localStorage, shows "Signout success",
 *   then navigates to /login.
 *
 * This file replaces the previous simple button so that navigating to "/logout"
 * presents a confirmation dialog instead of immediately redirecting.
 */

export default function Logout() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true); // open on mount
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && modalOpen && !isProcessing) {
        setModalOpen(false);
        // If user closes modal without confirming, return them to previous page (dashboard)
        navigate(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, isProcessing, navigate]);

  useEffect(() => {
    // When modal opens, focus the Cancel button for safety (keyboard users).
    if (modalOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [modalOpen]);

  const handleCancel = () => {
    if (isProcessing) return;
    setModalOpen(false);
    navigate(-1); // go back if they cancel
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      localStorage.removeItem("username");
    } catch (e) {
      // ignore
    }

    setSuccess(true);

    // Give user a moment to see "Signout success" then navigate to login.
    setTimeout(() => {
      setIsProcessing(false);
      setModalOpen(false);
      navigate("/login");
    }, 900);
  };

  // If for some reason the modal is closed programmatically and we are still on /logout,
  // navigate back to previous page to avoid leaving a blank route.
  useEffect(() => {
    if (!modalOpen && !success) {
      // navigate back after a small delay to allow UI to close
      const t = setTimeout(() => navigate(-1), 120);
      return () => clearTimeout(t);
    }
  }, [modalOpen, success, navigate]);

  if (!modalOpen && success === false) {
    // Modal closed and not signing out — don't render anything (route will navigate back).
    return null;
  }

  return (
    <>
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: 420,
              maxWidth: "100%",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              padding: "20px 20px",
              textAlign: "center",
            }}
          >
            {!success ? (
              <>
                <h2
                  id="logout-dialog-title"
                  style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}
                >
                  Are you sure you want to logout?
                </h2>

                <p style={{ marginTop: 10, color: "#444", fontSize: 14 }}>
                  You will be signed out of your account and redirected to the login page.
                </p>

                <div style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "center" }}>
                  <button
                    ref={cancelBtnRef}
                    onClick={handleCancel}
                    disabled={isProcessing}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "1px solid #cfcfcf",
                      background: "#fff",
                      color: "#111",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      minWidth: 110,
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    ref={confirmBtnRef}
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "none",
                      background: "#d9534f",
                      color: "#fff",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      minWidth: 110,
                    }}
                  >
                    {isProcessing ? "Signing out..." : "Yes, Sign out"}
                  </button>
                </div>
              </>
            ) : (
              // Success message
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}>
                  Signout success
                </h2>
                <p style={{ marginTop: 10, color: "#444" }}>Redirecting to login…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}