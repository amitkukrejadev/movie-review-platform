import { createContext } from "react";

/**
 * AuthContext
 * Single-file that only exports the context object to avoid
 * react-refresh/only-export-components problems.
 */
const AuthContext = createContext(null);

export default AuthContext;
