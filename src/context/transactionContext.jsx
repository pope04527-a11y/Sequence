import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "https://sequence-admins.onrender.com";

  // Canonical token getter: prefer authToken, fallback to token (backwards compatibility)
  const getToken = () => {
    try {
      return localStorage.getItem("authToken") || localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  };

  const fetchTransactions = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/transactions`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits || []);
        setWithdrawals(data.withdrawals || []);
      }
    } catch (err) {
      setDeposits([]);
      setWithdrawals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // You can call refresh after a new deposit or withdraw
  const refresh = fetchTransactions;

  return (
    <TransactionContext.Provider value={{
      deposits,
      withdrawals,
      loading,
      refresh
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
