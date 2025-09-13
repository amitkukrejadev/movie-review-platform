// frontend/src/context/MovieContext.jsx
import React, { createContext } from "react";
import { useMovies } from "./useMovies"; // your existing hook

// default context shape
const MovieContext = createContext({
  movies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  loadPage: () => {},
  search: () => Promise.resolve([]),
});

export function MovieProvider({ children }) {
  // You can log here to verify it's running
  const { movies, loading, error, page, totalPages, loadPage, search } =
    useMovies({ initialPage: 1, limit: 24 });

  // small debug - remove after confirmed working
  // console.log("MovieProvider: movies", movies?.length, "loading", loading, "err", error);

  return (
    <MovieContext.Provider
      value={{ movies, loading, error, page, totalPages, loadPage, search }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContext;
