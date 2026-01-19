import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import "./Records.css";

import homeIcon from "../assets/images/tabBar/homeh.png";
import startingIcon from "../assets/images/tabBar/icon30.png";
import recordsIcon from "../assets/images/tabBar/records.png";

/*
  Records.jsx

  Changes:
  - Removed the local Header render so the page uses the global header (provided by Layout).
  - Removed the page-level bottom navigation bar so no duplicate navbars appear.
  - Ensured every product name is displayed in Title Case (capitalized words).
  - Kept all logic intact (fetching records, submit flow, combo handling, toasts, timers).
  - Kept the platform gradient/color styling and the updated order card layout from previous changes.
*/

const tabs = ["All", "Pending", "Completed"];

const START_BLUE = "#1fb6fc";
const BLACK_BG = "#071e3d";

function SpinnerOverlay({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 11000,
        background: "rgba(245,247,251,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: "6px solid #ddd",
          borderTop: `6px solid ${START_BLUE}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}
      />
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}

function GreyToast({ show, message }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "22%",
        transform: "translateX(-50%)",
        background: "#eee",
        color: "#666",
        borderRadius: 10,
        padding: "10px 28px",
        fontWeight: 500,
        fontSize: 15.5,
        boxShadow: "0 2px 12px #0001",
        zIndex: 99999,
        minWidth: 210,
        maxWidth: "80vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          border: "3px solid #e0e0e0",
          borderTop: "3px solid #bbb",
          borderRadius: "50%",
          marginRight: 13,
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span>{message}</span>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* Helper to convert product names to Title Case */
function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : w)
    .join(" ");
}

const Records = () => {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();
  const { records, submitTaskRecord, refreshRecords } = useTaskRecords();
  const { balance, commissionToday, refreshProfile } = useBalance();
  const [submitting, setSubmitting] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setShowSpinner(true);
    refreshRecords && refreshRecords();
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // Only on mount

  useEffect(() => {
    if (showSpinner) return;
    const interval = setInterval(() => {
      refreshRecords && refreshRecords();
    }, 1000);
    return () => clearInterval(interval);
  }, [showSpinner, refreshRecords]);

  function getPendingComboGroups(records) {
    const groups = {};
    for (const rec of records) {
      if (rec.status === "Pending" && rec.comboGroupId) {
        if (!groups[rec.comboGroupId]) groups[rec.comboGroupId] = [];
        groups[rec.comboGroupId].push(rec);
      }
    }
    Object.values(groups).forEach(arr =>
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
    return groups;
  }

  function getLastPendingComboTaskCode(comboRecords) {
    if (!comboRecords || comboRecords.length === 0) return null;
    return comboRecords[comboRecords.length - 1].taskCode;
  }

  const getRecordKey = (record, i) => {
    if (record.isCombo && typeof record.comboIndex !== "undefined") {
      return `${record.taskCode || record._id || "noid"}-combo-${record.comboIndex}`;
    }
    return record.taskCode || record._id || `idx-${i}`;
  };

  const showGrey = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  const handleSubmit = async (task) => {
    if (task.isCombo && task.canSubmit && balance < 0) {
      showGrey("Insufficient Balance.");
      setTimeout(() => {
        navigate("/deposit");
      }, 1600);
      return;
    }
    setSubmitting((prev) => ({ ...prev, [task.taskCode]: true }));
    setSubmitted((prev) => ({ ...prev, [task.taskCode]: false }));
    setTimeout(async () => {
      const result = await submitTaskRecord(task.taskCode);
      setSubmitting((prev) => ({ ...prev, [task.taskCode]: false }));
      if (!result.success && result.mustDeposit) {
        showGrey("Insufficient Balance.");
        setTimeout(() => {
          navigate("/deposit");
        }, 1600);
        return;
      }
      if (!result.success) {
        alert(result.message || "Failed to submit task.");
      } else {
        setSubmitted((prev) => ({ ...prev, [task.taskCode]: true }));
        await refreshProfile();
        refreshRecords && refreshRecords();
        setTimeout(() => {
          setSubmitted((prev) => ({ ...prev, [task.taskCode]: false }));
        }, 1500);
      }
    }, 3000);
  };

  const filteredRecords = records.filter(
    (record) =>
      activeTab === "All" ||
      (record.status && record.status.toLowerCase() === activeTab.toLowerCase())
  );

  const pendingComboGroups = getPendingComboGroups(filteredRecords);
  const lastPendingComboTaskCodes = Object.values(pendingComboGroups).map(getLastPendingComboTaskCode);

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (
      a.comboGroupId &&
      b.comboGroupId &&
      a.comboGroupId === b.comboGroupId &&
      a.status === "Pending" &&
      b.status === "Pending"
    ) {
      return (b.canSubmit ? 1 : 0) - (a.canSubmit ? 1 : 0);
    }
    return new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt);
  });

  const getRecordImage = (product) => {
    if (
      product &&
      typeof product.image === "string" &&
      product.image.trim() !== "" &&
      product.image !== "null"
    ) {
      return product.image;
    }
    return "/assets/images/products/default.png";
  };

  // Render single record row styled like screenshot
  const renderProductRecord = (record, i) => {
    const badgeColor =
      record.status === "Pending" ? "#ff9f1c" :
      record.status === "Frozen" ? "#ff6b6b" :
      record.status === "Completed" ? START_BLUE : "#8fadc7";

    return (
      <div
        key={getRecordKey(record, i)}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 14,
          boxShadow: "0 6px 24px rgba(5,20,40,0.12)",
          marginBottom: 20,
          border: "1px solid #eef2f6",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          gap: 16,
          alignItems: "flex-start"
        }}
      >
        {/* left image */}
        <div style={{ width: 92, height: 92, flex: "0 0 92px" }}>
          <img
            src={getRecordImage(record.product)}
            alt={record.product?.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 10,
              border: "1px solid #f2f4f7",
              background: "#fafafa"
            }}
          />
        </div>

        {/* middle content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#9aa7b6", fontSize: 12, marginBottom: 6 }}>
                {record.completedAt
                  ? new Date(record.completedAt).toLocaleString()
                  : record.startedAt
                  ? new Date(record.startedAt).toLocaleString()
                  : record.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : ""}
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#0b2b4a",
                marginBottom: 8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {toTitleCase(record.product?.name || "")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ color: "#f5b500" }}>
                  {/* simple 5-star visual */}
                  <span style={{ fontSize: 14 }}>★★★★★</span>
                </div>
              </div>
            </div>

            {/* Status badge top-right */}
            <div style={{ marginLeft: 12 }}>
              <div style={{
                background: badgeColor,
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 12,
                textTransform: "capitalize"
              }}>
                {record.status}
              </div>
            </div>
          </div>

          {/* bottom row - totals and commission */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            paddingTop: 10,
            borderTop: "1px dashed #eef3f7"
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#9aa7b6" }}>Total Amount</div>
              <div style={{ fontWeight: 800, color: START_BLUE }}>
                <span style={{ color: BLACK_BG, fontWeight: 700, marginRight: 6 }}>GBP</span>
                {record.product?.price}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#9aa7b6", textAlign: "right" }}>Commission</div>
              <div style={{ fontWeight: 800, color: START_BLUE, textAlign: "right" }}>
                <span style={{ color: BLACK_BG, fontWeight: 700, marginRight: 6 }}>GBP</span>
                {record.product?.commission || "0.00"}
              </div>
            </div>
            <div style={{ width: 140, marginLeft: 12 }}>
              {/* show submit button only when appropriate */}
              {(
                ((record.status === "Pending" && (!record.isCombo || record.canSubmit)) ||
                  (submitted[record.taskCode] && record.status === "Completed"))
              ) && (
                (!record.comboGroupId ||
                  lastPendingComboTaskCodes.includes(record.taskCode) ||
                  record.canSubmit) && (
                  <button
                    className="submit-btn"
                    onClick={() => handleSubmit(record)}
                    disabled={submitting[record.taskCode] || submitted[record.taskCode]}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: submitted[record.taskCode] ? START_BLUE : START_BLUE,
                      color: "#fff",
                      borderRadius: 10,
                      border: "none",
                      fontWeight: 700,
                      cursor: submitting[record.taskCode] ? "wait" : "pointer",
                      boxShadow: `0 6px 18px ${START_BLUE}22`
                    }}
                  >
                    {submitting[record.taskCode] ? "Submitting..." : submitted[record.taskCode] ? "Submitted" : "Submit"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        /* page gradient & overlay matching platform */
        .records-gradient-bg {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(120deg, #071e2f 0%, #1f4287 45%, #278ea5 85%, #21e6c1 100%);
          position: relative;
        }
        .records-gradient-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(7,30,61,0.92) 60%, rgba(39,142,165,0.80) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .records-centered {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 16px 120px 16px;
          box-sizing: border-box;
          color: #fff;
        }
        .records-section-title {
          font-size: 34px;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #fff;
        }
        .records-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          background: rgba(255,255,255,0.04);
          padding: 8px;
          border-radius: 12px;
        }
        .records-tab {
          flex: 1;
          text-align: center;
          padding: 10px 8px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
        }
        .records-tab.active {
          background: rgba(255,255,255,0.06);
          color: #fff;
          box-shadow: inset 0 -6px 18px rgba(0,0,0,0.12);
          border: 1px solid rgba(255,255,255,0.02);
        }

        @media (max-width: 520px) {
          .records-centered { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>

      {/* Do not render a local Header here so the global header from Layout is used */}

      <SpinnerOverlay show={showSpinner} />
      <GreyToast show={greyToast.show} message={greyToast.message} />

      <div className="records-gradient-bg">
        <div className="records-centered">
          <h1 className="records-section-title">Orders</h1>

          <div className="records-tabs" role="tablist" aria-label="Order filters">
            {tabs.map((t) => (
              <div
                key={t}
                role="tab"
                aria-selected={activeTab === t}
                className={`records-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </div>
            ))}
          </div>

          {/* list */}
          <div style={{ marginTop: 6 }}>
            {showSpinner ? (
              <div style={{ height: 120 }} />
            ) : sortedRecords.length === 0 ? (
              <div style={{ padding: 36, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                <div style={{ color: "rgba(255,255,255,0.85)", textAlign: "center" }}>No orders found</div>
              </div>
            ) : (
              sortedRecords.map((record, i) => renderProductRecord(record, i))
            )}
          </div>

          {/* informational foot note inside gradient */}
          <div style={{ marginTop: 28, color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
            <p style={{ margin: 0 }}>
              
            </p>
          </div>
        </div>
      </div>

      {/* Removed local bottom navbars so the app's global footer/header remain single and consistent */}
    </div>
  );
};

export default Records;