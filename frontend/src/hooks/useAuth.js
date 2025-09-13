// frontend/src/hooks/useAuth.js
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Safe useAuth hook:
 * - Returns the auth context when present.
 * - If the provider is not mounted, returns a default object with user:null.
 * This avoids throwing and allows calling the hook at top-level of components.
 */
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // do not throw — return a safe default so components can call this hook
    return { user: null, loading: false, login: () => {}, logout: () => {} };
  }
  return ctx;
}
