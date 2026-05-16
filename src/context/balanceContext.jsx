import React, { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = "https://sequence-admins.onrender.com";

export const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [commissionToday, setCommissionToday] = useState(0);
  const [taskCountToday, setTaskCountToday] = useState(0);
  const [username, setUsername] = useState("");
  const [vipLevel, setVipLevel] = useState("VIP1");
  const [userProfile, setUserProfile] = useState(null);

  // Canonical token getter: prefer authToken, fallback to token (backwards compatibility)
  const getToken = () => {
    try {
      return localStorage.getItem("authToken") || localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  };

  // Fetch user profile from backend on mount or after login
  const fetchProfile = async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_URL}/api/user-profile`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.user) {
        setUsername(data.user.username || "");
        setBalance(data.user.balance ?? 0);
        setVipLevel(data.user.vipLevel || "VIP1");
        setCommissionToday(data.user.commissionToday ?? 0);
        setTaskCountToday(
          typeof data.user.taskCountThisSet === "number"
            ? data.user.taskCountThisSet
            : (data.user.taskCountToday ?? 0)
        );
        setUserProfile(data.user);
        return data.user;
      } else {
        // If response was ok but contained no user, clear profile to avoid stale info
        setUserProfile(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      return null;
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchProfile().catch(() => {});
    // Listen for cross-app balance updates dispatched by task start/submit handlers.
    const onBalanceUpdated = (e) => {
      try {
        const d = (e && e.detail) || {};
        if (typeof d.balance !== "undefined") {
          setBalance(d.balance);
        }
        if (typeof d.commissionToday !== "undefined") {
          setCommissionToday(d.commissionToday);
        }
        if (d.userProfile) {
          setUserProfile(d.userProfile);
          setUsername(d.userProfile.username || "");
          setVipLevel(d.userProfile.vipLevel || "VIP1");
          setTaskCountToday(
            typeof d.userProfile.taskCountThisSet === "number"
              ? d.userProfile.taskCountThisSet
              : (d.userProfile.taskCountToday ?? 0)
          );
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener("balanceUpdated", onBalanceUpdated);

    // Also respond to storage events so multiple tabs keep in sync
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "authToken" || ev.key === "token" || ev.key === "currentUser") {
        // token changed (login/logout) or currentUser changed — refresh profile
        fetchProfile().catch(() => {});
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("balanceUpdated", onBalanceUpdated);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: call this after task start or submit to update balance etc from backend
  const refreshProfile = fetchProfile;

  // Deposit
  const deposit = async (amount) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) await refreshProfile();
    } catch (err) {
      console.error("Failed to deposit", err);
    }
  };

  // Withdraw
  const withdraw = async (amount) => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_URL}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) await refreshProfile();
      return data.success;
    } catch (err) {
      console.error("Failed to withdraw", err);
      return false;
    }
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        deposit,
        withdraw,
        commissionToday,
        setCommissionToday,
        taskCountToday,
        setTaskCountToday,
        username,
        vipLevel,
        setVipLevel,
        refreshProfile,
        userProfile,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  return useContext(BalanceContext);
}
