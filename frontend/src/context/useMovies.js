// frontend/src/context/useMovies.js
import { useContext } from "react";
import { MovieContext } from "./MovieContext";

export function useMovies() {
  const ctx = useContext(MovieContext);
  if (!ctx) {
    throw new Error("useMovies must be used inside a MovieProvider");
  }
  return ctx;
}
