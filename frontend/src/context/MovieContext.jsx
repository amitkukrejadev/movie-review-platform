// frontend/src/context/MovieContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import * as api from "../utils/api";

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [moviesByPage, setMoviesByPage] = useState({});
  const [moviesMap, setMoviesMap] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (pageToLoad = 1) => {
      if (moviesByPage[pageToLoad]) {
        setPage(pageToLoad);
        return moviesByPage[pageToLoad];
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchMovies(pageToLoad);
        const movies = data?.movies || [];
        setMoviesByPage((prev) => ({ ...prev, [pageToLoad]: movies }));
        setMoviesMap((prev) => {
          const copy = { ...prev };
          movies.forEach((m) => {
            if (m && m._id) copy[m._id] = m;
          });
          return copy;
        });

        setPage(data.page || pageToLoad);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || movies.length);
        return movies;
      } catch (err) {
        setError(err?.message || String(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [moviesByPage]
  );

  const getMovie = useCallback(
    (id) => {
      return moviesMap[id] || null;
    },
    [moviesMap]
  );

  const fetchMovie = useCallback(
    async (id) => {
      if (moviesMap[id]) return moviesMap[id];

      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchMovieById(id);
        const movie = data?.movie || data;
        if (movie && movie._id) {
          setMoviesMap((prev) => ({ ...prev, [movie._id]: movie }));
        }
        return movie;
      } catch (err) {
        setError(err?.message || String(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [moviesMap]
  );

  useEffect(() => {
    if (!moviesByPage[1]) {
      loadPage(1).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    moviesByPage,
    moviesMap,
    page,
    totalPages,
    total,
    loading,
    error,
    loadPage,
    getMovie,
    fetchMovie,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}

// expose the context object (not the hook) so the consumer-hook can use it.
// NOTE: do not export any hooks or non-component items from this file.
// Other files should import the hook from `useMovies.js`.
export { MovieContext };

export default MovieProvider;
