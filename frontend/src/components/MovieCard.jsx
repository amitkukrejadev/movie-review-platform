// frontend/src/components/MovieCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTMDBPoster } from "../utils/api";

/**
 * MovieCard
 * - Shows movie poster (seeded posterUrl, TMDB lookup, then local fallback)
 * - On image error swaps to fallback
 *
 * Note: To enable TMDB lookups, set VITE_TMDB_API_KEY in frontend/.env
 * and restart Vite.
 */
export default function MovieCard({ movie }) {
  const PLACEHOLDER_REMOTE =
    "https://via.placeholder.com/300x450?text=No+Poster";
  const LOCAL_FALLBACK = "/posters/placeholder.png"; // put a small placeholder in frontend/public/posters/

  const [posterSrc, setPosterSrc] = useState(movie.posterUrl || "");
  const [triedTMDB, setTriedTMDB] = useState(false);

  useEffect(() => {
    let mounted = true;

    // If there is no poster or it's the via.placeholder we seeded, try TMDB (once)
    const isSeedPlaceholder =
      !posterSrc ||
      posterSrc.includes("via.placeholder.com") ||
      posterSrc.endsWith("No+Poster");

    if (isSeedPlaceholder && !triedTMDB) {
      (async () => {
        setTriedTMDB(true);
        const tmdb = await fetchTMDBPoster(movie.title, movie.year);
        if (mounted) {
          if (tmdb) {
            setPosterSrc(tmdb);
          } else {
            // ensure we have some fallback (local if available)
            setPosterSrc(LOCAL_FALLBACK);
          }
        }
      })();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie._id]); // run when movie changes

  function handleImgError(e) {
    // fallback order handled by state: if an img fails, set to local fallback
    const src = e?.target?.src;
    if (!src) return;
    if (!src.includes("/posters/placeholder.png")) {
      e.target.src = LOCAL_FALLBACK;
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="w-full h-48 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
        <img
          src={posterSrc || PLACEHOLDER_REMOTE}
          alt={`Poster for ${movie.title}`}
          onError={handleImgError}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="mt-2 font-semibold text-lg">{movie.title}</h3>
      <p className="text-sm text-gray-500">
        {movie.genre} • {movie.year}
      </p>
      <Link
        to={`/movies/${movie._id}`}
        className="text-indigo-600 text-sm mt-2 inline-block"
        aria-label={`View ${movie.title}`}
      >
        View
      </Link>
    </div>
  );
}
