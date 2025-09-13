import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * useAuth hook
 * Small wrapper that enforces being inside provider.
 */
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
