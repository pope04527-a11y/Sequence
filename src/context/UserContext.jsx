import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use production backend
  const BASE_URL = "https://sequence-admins.onrender.com";

  // Canonical token getter: prefer authToken, fallback to token (backwards compatibility)
  const getToken = () => {
    try {
      return localStorage.getItem("authToken") || localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  };

  // Load user from localStorage first, then refresh from backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Refresh user from backend to get up-to-date data
          await refreshUser(parsedUser.username);
        }
      } catch (error) {
        console.error("Invalid user data in localStorage. Clearing it.", error);
        localStorage.removeItem("user");
      }
      setLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        // ignore localStorage write errors
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Refresh user data by fetching from backend
  const refreshUser = async (username) => {
    if (!username) return;
    const token = getToken();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["x-auth-token"] = token;
      const res = await axios.get(`${BASE_URL}/api/admin/users/${username}`, { headers });
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // Optionally clear user on failure
      // setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );

};
