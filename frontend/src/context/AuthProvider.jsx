import React, { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";

/**
 * AuthProvider
 * Keeps side-effects inside the provider component only.
 * Default export (component) — no other named exports from this file.
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mrv_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("mrv_user", JSON.stringify(user));
    else localStorage.removeItem("mrv_user");
  }, [user]);

  const login = useCallback(async (creds) => {
    // placeholder: swap for real API call later
    const dummy = {
      id: "local-user",
      name: creds?.name || "Amit",
      email: creds?.email || "amit@example.com",
    };
    setUser(dummy);
    return dummy;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
