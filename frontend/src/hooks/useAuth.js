// frontend/src/context/useAuth.js
import { useContext } from "react";
import AuthContext from "./AuthContext"; // default import from AuthContext.jsx

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
