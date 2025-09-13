// frontend/src/context/MovieContextValue.jsx
import { createContext } from "react";

/**
 * Context value shape (defaults) — simple defaults so components can read safely
 */
const MovieContext = createContext({
  movies: [],
  page: 1,
  totalPages: 1,
  loadPage: () => {},
  loading: false,
  error: null,
  search: async () => [],
});

export default MovieContext;
