// src/pages/Dashboards.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import accessIcon from "../assets/images/dashboard/access.png";
import rechargeIcon from "../assets/images/dashboard/recharge.png";
import withdrawalIcon from "../assets/images/dashboard/withdrawal.png";
import transactionIcon from "../assets/images/dashboard/record.png";
import accountIcon from "../assets/images/dashboard/myaccount.png";
import referralIcon from "../assets/images/dashboard/invitation.png";
import ordersIcon from "../assets/images/dashboard/order.png";
import fundsIcon from "../assets/images/dashboard/record (2).png";
import walletIcon from "../assets/images/dashboard/reward.png";
import signIcon from "../assets/images/dashboard/sign.svg";
import "./Dashboards.css";

import { useBalance } from "../context/balanceContext";
import { useTaskRecords } from "../context/TaskRecordsContext";

/*
  Final adjustments:
  - "Transaction History" and "Funds" cards now link to the TransactionHistory page ("/transaction-history").
  - Kept prior styling and behavior (compact top stat box, 30-day registered days, custom scrollbar, compact section cards).
  - No other features/logic removed.
*/

const vipConfig = {
  1: { taskLimit: 40 },
  2: { taskLimit: 45 },
  3: { taskLimit: 50 },
  4: { taskLimit: 55 },
};

const START_BLUE = "#1fb6fc";

// helper: date key
function toDateKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
}

/* TopStatBox: compact with bold labels/values */
function TopStatBox({ accountBalance, commissionToday, frozenAmount, dataCount, dataMax }) {
  const rowStyle = {
    padding: "6px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const labelStyle = { color: "rgba(255,255,255,0.9)", marginBottom: 4, fontSize: 15, fontWeight: 800 };
  const valueStyle = { fontSize: 18, fontWeight: 900 };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 8,
        padding: "8px 10px",
        marginBottom: 12,
        boxSizing: "border-box",
        background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={rowStyle}>
          <div style={labelStyle}>Account Balance (GBP)</div>
          <div style={valueStyle}>{Number(accountBalance || 0).toFixed(2)}</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.04)", margin: "6px 0" }} />

        <div style={rowStyle}>
          <div style={labelStyle}>Today's Commission (GBP)</div>
          <div style={valueStyle}>{Number(commissionToday || 0).toFixed(2)}</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.04)", margin: "6px 0" }} />

        <div style={rowStyle}>
          <div style={labelStyle}>Frozen Amount (GBP)</div>
          <div style={valueStyle}>{Number(frozenAmount || 0).toFixed(2)}</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.04)", margin: "6px 0" }} />

        <div style={rowStyle}>
          <div style={labelStyle}>DATA</div>
          <div style={{ ...valueStyle, fontSize: 16 }}>{`${Number(dataCount || 0)} / ${Number(dataMax || 0)}`}</div>
        </div>
      </div>
    </div>
  );
}

/* RegisteredDays: 30 tiles, manual horizontal scroll, custom scrollbar UI (right arrow only) */
function RegisteredDays({ records, userProfile, todaysTasks, maxTasks }) {
  const REQUIRED_SETS = 2;
  const userId = (userProfile && (userProfile.username || userProfile.id)) || "guest";
  const storageKey = `signin_${userId}`;

  const completedTasksToday = useMemo(() => {
    if (!records || !userProfile) return 0;
    const todayKey = toDateKey(new Date());
    let count = 0;
    records.forEach((r) => {
      const created = r.createdAt || r.created || r.updatedAt || r.date;
      if (!created) return;
      const k = toDateKey(new Date(created));
      if (k === todayKey && r.status === "Completed") count += 1;
    });
    return count;
  }, [records, userProfile]);

  const setsCompletedToday = Math.floor((completedTasksToday || 0) / (maxTasks || 1));
  const displayedSets = Math.min(setsCompletedToday, REQUIRED_SETS);

  const loadSign = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return { signedCount: 0, lastSignDate: null };
      return JSON.parse(raw);
    } catch (e) {
      return { signedCount: 0, lastSignDate: null };
    }
  };
  const [signState, setSignState] = useState(loadSign);

  const signedToday = signState.lastSignDate === toDateKey(new Date());

  const handleSignIn = () => {
    if (signedToday) return;
    if (setsCompletedToday < REQUIRED_SETS) {
      alert(`You must complete ${REQUIRED_SETS} sets to sign in. Progress: ${displayedSets}/${REQUIRED_SETS}`);
      return;
    }
    const yesterdayKey = toDateKey(new Date(Date.now() - 86400000));
    let newCount = 1;
    if (signState.lastSignDate === yesterdayKey) {
      newCount = (signState.signedCount || 0) + 1;
    } else if (signState.lastSignDate === toDateKey(new Date())) {
      newCount = signState.signedCount || 1;
    } else {
      newCount = 1;
    }
    if (newCount > 30) newCount = 30;
    const newState = { signedCount: newCount, lastSignDate: toDateKey(new Date()) };
    setSignState(newState);
    try { localStorage.setItem(storageKey, JSON.stringify(newState)); } catch (e) {}
    if (newCount === 5) alert("5-day streak reached — 500 GBP reward!");
    if (newCount === 15) alert("15-day streak reached — 1500 GBP reward!");
    if (newCount === 30) alert("30-day streak reached — 3000 GBP reward!");
  };

  const days = Array.from({ length: 30 }).map((_, i) => {
    const idx = i + 1;
    const signed = idx <= (signState.signedCount || 0);
    const milestone = idx === 5 ? "500 GBP" : idx === 15 ? "1500 GBP" : idx === 30 ? "3000 GBP" : null;
    return { idx, signed, milestone };
  });

  const signEnabled = !signedToday && setsCompletedToday >= REQUIRED_SETS;

  const scrollRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({ left: 0, width: 1, client: 1 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollInfo({ left: el.scrollLeft, width: el.scrollWidth, client: el.clientWidth });
    onScroll();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [days.length]);

  const trackWidth = 360;
  const visibleRatio = scrollInfo.client / Math.max(1, scrollInfo.width);
  const thumbWidth = Math.max(36, trackWidth * visibleRatio);
  const maxScrollLeft = Math.max(0, scrollInfo.width - scrollInfo.client);
  const thumbLeft = maxScrollLeft > 0 ? (scrollInfo.left / maxScrollLeft) * (trackWidth - thumbWidth) : 0;

  const scrollBy = (delta) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const targetRatio = Math.max(0, Math.min(1, (clickX - thumbWidth / 2) / (trackWidth - thumbWidth)));
    const el = scrollRef.current;
    if (!el) return;
    const targetLeft = targetRatio * Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <div className="dashboard-registered-card">
      <style>{`
        .dashboard-registered-days-list::-webkit-scrollbar { height: 0px; display: none; }
        .dashboard-registered-days-list { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="dashboard-registered-title-row" style={{ alignItems: "center" }}>
        <span className="dashboard-registered-title">Registered working days</span>
        <button
          className="dashboard-signin-btn"
          onClick={handleSignIn}
          disabled={!signEnabled}
          aria-disabled={!signEnabled}
          style={{
            background: signEnabled ? "#19c1a9" : "#bfc2c6",
            color: signEnabled ? "#012" : "#fff",
            fontWeight: 800,
            borderRadius: 20,
            padding: "8px 14px",
            border: "none",
            cursor: signEnabled ? "pointer" : "not-allowed",
            fontSize: 14,
          }}
        >
          {`Sign in immediately (${Math.min(setsCompletedToday, REQUIRED_SETS)}/${REQUIRED_SETS})`}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="dashboard-registered-days-list"
        style={{
          overflowX: "auto",
          display: "flex",
          gap: 12,
          padding: "8px 6px",
          alignItems: "center",
        }}
      >
        {days.map((d) => (
          <div
            key={d.idx}
            className="dashboard-day-item"
            style={{
              minWidth: 88,
              maxWidth: 88,
              flex: "0 0 auto",
              borderRadius: 8,
              background: "#fff",
              boxShadow: "0 6px 18px rgba(3,12,23,0.06)",
              padding: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Use signIcon for the tile image */}
            <img
              src={signIcon}
              alt={`Day ${d.idx}`}
              className="dashboard-day-icon"
              style={{ width: 40, height: 40, marginBottom: 6, opacity: d.signed ? 1 : 0.95 }}
            />
            <div className="dashboard-day-label" style={{ fontWeight: 800, fontSize: 11 }}>
              {`DAY ${d.idx}`}
            </div>

            {!d.signed && (
              <div style={{ position: "absolute", left: 6, top: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V8a6 6 0 1112 0v2" stroke="#14a6d1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="#14a6d1" strokeWidth="1.2" fill="none" />
                </svg>
              </div>
            )}

            {d.milestone && d.signed && (
              <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, background: "#1fb6fc", color: "#fff", fontSize: 10, padding: "3px 6px", borderRadius: 6, textAlign: "center" }}>
                {d.milestone}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom scrollbar UI (only RIGHT arrow remains) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div
          onClick={onTrackClick}
          style={{
            width: 360,
            height: 12,
            borderRadius: 999,
            background: "#eee",
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          role="slider"
          aria-label="Days scroll track"
        >
          <div
            style={{
              position: "absolute",
              left: thumbLeft,
              top: 1,
              width: thumbWidth,
              height: 10,
              borderRadius: 999,
              background: "#b6b6b6",
              transition: "left 120ms linear",
            }}
          />
        </div>

        <button
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            el.scrollBy({ left: 160, behavior: "smooth" });
          }}
          aria-label="Scroll right"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#fff",
            border: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* Section component updated to render compact uniform cards for Asset/Profile/History.
   Styles applied inline so we don't change external stylesheets.
*/
function Section({ title, items }) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-title" style={{ color: "#fff", fontWeight: 800, marginBottom: 8 }}>{title}</div>
      {items.map((item, i) => (
        <Link
          to={item.link}
          className="dashboard-card"
          key={i}
          aria-label={`${item.title} - ${item.desc}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            minHeight: 96,
            marginBottom: 14,
            borderRadius: 8,
            background: "#fff",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 6px 18px rgba(3,12,23,0.06)"
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <img src={item.icon} alt={item.title + " icon"} style={{ width: 44, height: 44 }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0b2b4a", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: "#9aa4b2", marginBottom: 8 }}>{item.desc}</div>
            <div style={{ color: START_BLUE, fontWeight: 700, fontSize: 13 }}>Explore More &gt;</div>
          </div>
        </Link>
      ))}
    </section>
  );
}

const assetItems = [
  { icon: accessIcon, title: "Access", desc: "Explore your loyalty rewards & track your progress", link: "/tasks" },
  { icon: rechargeIcon, title: "Recharge", desc: "Recharge to increase your profits", link: "/deposit" },
  { icon: withdrawalIcon, title: "Withdrawal", desc: "Cash out your funds", link: "/withdraw" },
];

// Transaction History link updated to /transaction-history
const profileItems = [
  { icon: transactionIcon, title: "Transaction History", desc: "Track your recharges, withdrawals & earnings history", link: "/transaction-history" },
  { icon: accountIcon, title: "My Account", desc: "Manage your sign in & password details", link: "/profile" },
  { icon: referralIcon, title: "Referral Code", desc: "Get your amazing rewards", link: "/referral" },
];

// Funds link updated to /transaction-history
const historyItems = [
  { icon: ordersIcon, title: "Orders", desc: "Track your orders status", link: "/records" },
  { icon: fundsIcon, title: "Funds", desc: "Track your recharges, withdrawals & earnings history", link: "/transaction-history" },
  { icon: walletIcon, title: "Bind Wallet Address", desc: "Bind your wallet information", link: "/bind-wallet" },
];

export default function Dashboards() {
  const { balance, commissionToday, vipLevel, refreshProfile, userProfile } = useBalance();
  const { records } = useTaskRecords();

  // display name
  const displayName =
    (userProfile && (userProfile.fullName || userProfile.username || userProfile.name)) ||
    (() => {
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.fullName || parsed.username || parsed.name || "User";
        }
      } catch (e) { }
      return "User";
    })();

  const membershipTier = userProfile && userProfile.tier
    ? userProfile.tier
    : `VIP${vipLevel || (userProfile && userProfile.vipLevel) || 1}`;

  const credibilityPercent =
    (userProfile && (userProfile.credibility || userProfile.credibilityPercent)) ||
    100;

  const frozenAmount = (userProfile && (userProfile.frozenAmount || userProfile.frozen)) || 0;

  // compute todays completed tasks (original logic)
  function computeTodaysTasks(recordsList, profile) {
    if (!recordsList || !profile) return 0;
    const currentSet = profile.currentSet ?? 1;
    let comboTaskCodes = new Set();
    let count = 0;
    recordsList.forEach((r) => {
      if (r.status === "Completed" && (r.set === currentSet || r.set === undefined)) {
        if (r.isCombo) {
          if (r.taskCode && !comboTaskCodes.has(r.taskCode)) {
            count += 1;
            comboTaskCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    let pendingComboCodes = new Set();
    let hasPendingCombo = false;
    recordsList.forEach((r) => {
      if (r.status === "Pending" && (r.set === currentSet || r.set === undefined)) {
        if (r.isCombo) {
          if (r.taskCode && !pendingComboCodes.has(r.taskCode)) {
            hasPendingCombo = true;
            pendingComboCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    if (hasPendingCombo) count += 1;
    return count;
  }

  const todaysTasks = computeTodaysTasks(records || [], userProfile || {});
  const maxTasks = (userProfile && userProfile.maxTasks) || vipConfig[Number(vipLevel)]?.taskLimit || 40;

  // refresh profile on mount
  useEffect(() => {
    refreshProfile && refreshProfile();
  }, [refreshProfile]);

  return (
    <main className="dashboard-main-bg">
      <div className="dashboard-centered-section">
        <h1 className="dashboard-title">Dashboard</h1>
        <hr className="dashboard-title-divider" />

        <div className="dashboard-welcome-card">
          <h2 className="dashboard-welcome-title">Welcome,</h2>
          <div className="dashboard-welcome-user">{displayName}</div>
          <div className="dashboard-welcome-membership">
            <span className="dashboard-welcome-tier">Membership Tier: {membershipTier}</span>
          </div>
          <div className="dashboard-welcome-credibility-row">
            <span className="dashboard-welcome-credibility-label">Credibility</span>
            <div className="dashboard-welcome-progress-bar" aria-hidden="true" style={{ marginLeft: 8, marginRight: 8, flex: 1 }}>
              <div className="dashboard-welcome-progress" style={{ width: `${Math.max(0, Math.min(100, Number(credibilityPercent || 100)))}%`, background: "#1f8fc0", height: 8, borderRadius: 6 }}></div>
            </div>
            <span className="dashboard-welcome-progress-text">{Math.max(0, Math.min(100, Number(credibilityPercent || 100)))}%</span>
          </div>
        </div>

        {/* Compact top stat box with bold labels and values */}
        <TopStatBox
          accountBalance={balance}
          commissionToday={commissionToday}
          frozenAmount={frozenAmount}
          dataCount={todaysTasks}
          dataMax={maxTasks}
        />

        {/* Registered working days */}
        <RegisteredDays
          records={records}
          userProfile={userProfile}
          todaysTasks={todaysTasks}
          maxTasks={maxTasks}
        />

        {/* Asset / Profile / History sections with compact uniform cards */}
        <Section title="Asset" items={assetItems} />
        <Section title="Profile" items={profileItems} />
        <Section title="History" items={historyItems} />
      </div>
    </main>
  );
}