import React, { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
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

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) return null;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user-profile`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
