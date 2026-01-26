import React, { useEffect, useState } from "react";
import csImage from "../assets/images/Cs.jpg";

// Path to your avatar image in the public folder
// (we now import the image from src/assets/images/Cs.jpg above)

export default function CustomerServiceModal({ open, onClose }) {
  const [links, setLinks] = useState({
    telegram1: "",
    telegram2: "",
    customerService: "",
  });

  useEffect(() => {
    if (!open) return;
    // Fixed fetch URL and added timestamp to avoid caching
    fetch("https://stacksapp-backend-main.onrender.com/service-links.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setLinks({
          telegram1: data.telegram1 || "",
          telegram2: data.telegram2 || "",
          customerService: data.whatsapp || "",
        });
      })
      .catch(() => {
        setLinks({ telegram1: "", telegram2: "", customerService: "" });
      });
  }, [open]);

  if (!open) return null;

  // Arrow icon styled to match platform accents (teal)
  const arrowIcon = (
    <svg width="20" height="20" viewBox="0 0 18 18" style={{ marginLeft: "auto" }} aria-hidden>
      <path
        d="M6 4l4 5-4 5"
        stroke="#3fe0c8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  // Avatar used for all rows (imported image)
  const avatar = (
    <img
      src={csImage}
      alt="service"
      data-i18n-alt="service"
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        marginRight: 14,
        objectFit: "cover",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        // darker translucent overlay to match platform look
        background: "linear-gradient(rgba(3,10,18,0.6), rgba(3,10,18,0.6))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s",
        padding: 16,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal box */}
      <div
        style={{
          // dark/blue gradient card to match platform theme (not white)
          background: "linear-gradient(180deg, rgba(6,30,46,0.98) 0%, rgba(11,44,74,0.98) 100%)",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(2,8,15,0.6)",
          minWidth: 360,
          maxWidth: 520,
          width: "100%",
          minHeight: 88,
          padding: 0,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px solid rgba(63,224,200,0.06)",
          color: "#eaf6ff", // light text color for contrast
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "6px 0" }}>
          {/* Telegram 1 */}
          <button
            onClick={() => {
              if (links.telegram1) {
                window.open(links.telegram1, "_blank");
                onClose();
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "12px 22px",
              cursor: links.telegram1 ? "pointer" : "not-allowed",
              opacity: links.telegram1 ? 1 : 0.5,
              fontSize: 16,
              fontWeight: 700,
              color: "#eaf6ff",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              outline: "none",
              textAlign: "left",
              transition: "background 0.12s",
            }}
            disabled={!links.telegram1}
          >
            {avatar}
            <span style={{ flex: "0 1 auto" }} data-i18n="Telegram">Telegram</span>
            {arrowIcon}
          </button>

          {/* Telegram 2 */}
          <button
            onClick={() => {
              if (links.telegram2) {
                window.open(links.telegram2, "_blank");
                onClose();
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "12px 22px",
              cursor: links.telegram2 ? "pointer" : "not-allowed",
              opacity: links.telegram2 ? 1 : 0.5,
              fontSize: 16,
              fontWeight: 700,
              color: "#eaf6ff",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              outline: "none",
              textAlign: "left",
              transition: "background 0.12s",
            }}
            disabled={!links.telegram2}
          >
            {avatar}
            <span style={{ flex: "0 1 auto" }} data-i18n="Telegram">Telegram</span>
            {arrowIcon}
          </button>

          {/* Customer Service */}
          <button
            onClick={() => {
              const username = localStorage.getItem("user");

              if (!username) {
                // kept original alert text; translator may replace visible UI strings.
                alert("Username not found — user must be logged in.");
                return;
              }

              const chatUrl = `https://stacks-chat.onrender.com/?user=${encodeURIComponent(username)}`;
              window.open(chatUrl, "_blank");
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "12px 22px",
              cursor: "pointer",
              opacity: 1,
              fontSize: 16,
              fontWeight: 700,
              color: "#eaf6ff",
              outline: "none",
              textAlign: "left",
              transition: "background 0.12s",
            }}
          >
            {avatar}
            <span style={{ flex: "0 1 auto" }} data-i18n="Customer Service">Customer Service</span>
            {arrowIcon}
          </button>
        </div>

        {/* Cancel link inside modal */}
        <div
          style={{
            textAlign: "center",
            padding: "10px 0 8px 0",
            borderTop: "1px solid rgba(255,255,255,0.03)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0))",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#3fe0c8",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "none",
              letterSpacing: 0.2,
              outline: "none",
              transition: "color 0.18s",
            }}
          >
            <span data-i18n="Cancel">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
