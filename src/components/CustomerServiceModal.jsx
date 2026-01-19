import React, { useEffect, useState } from "react";

export default function CustomerServiceModal({ open, onClose }) {
  const [links, setLinks] = useState({ telegram: "", whatsapp: "" });

  useEffect(() => {
    if (!open) return;
    // Fetch customer service links from public JSON file
    fetch("https://admin.stacksl.com/service-links.json?ts=" + Date.now())
      .then(res => res.json())
      .then(data => {
        setLinks({
          telegram: data.telegram || "",
          whatsapp: data.whatsapp || "",
        });
      })
      .catch((err) => {
        setLinks({ telegram: "", whatsapp: "" });
        console.error("Failed to fetch service links:", err);
      });
  }, [open]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.24)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px 28px 22px 28px",
          minWidth: 260,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
          textAlign: "center"
        }}
        onClick={e => e.stopPropagation()} // Prevent modal close on inner click
      >
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
          Contact Customer Service
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <button
            onClick={() => {
              console.log('Telegram button clicked', links.telegram);
              if (links.telegram) {
                window.open(links.telegram, "_blank");
                onClose();
              }
            }}
            style={{
              background: "#229ED9",
              color: "#fff",
              padding: "12px 0",
              fontSize: 17,
              fontWeight: 600,
              border: "none",
              borderRadius: 7,
              cursor: links.telegram ? "pointer" : "not-allowed",
              opacity: links.telegram ? 1 : 0.5
            }}
            disabled={!links.telegram}
          >
            Telegram
          </button>
          <button
            onClick={() => {
              console.log('WhatsApp button clicked', links.whatsapp);
              if (links.whatsapp) {
                window.open(links.whatsapp, "_blank");
                onClose();
              }
            }}
            style={{
              background: "#25d366",
              color: "#fff",
              padding: "12px 0",
              fontSize: 17,
              fontWeight: 600,
              border: "none",
              borderRadius: 7,
              cursor: links.whatsapp ? "pointer" : "not-allowed",
              opacity: links.whatsapp ? 1 : 0.5
            }}
            disabled={!links.whatsapp}
          >
            WhatsApp
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              color: "#888",
              border: "none",
              fontSize: 15,
              marginTop: 8,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
