// frontend/src/pages/MovieDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetails } from "../utils/tmdb";
import ReviewForm from "../components/ReviewForm";
import useAuth from "../hooks/useAuth";
import MovieCard from "../components/MovieCard";

/**
 * MovieDetail with:
 *  - review pagination (initial N, "Load more")
 *  - sync local reviews -> backend button (visible when logged in)
 *  - side panel with rating breakdown + recommended movies (TMDB similar)
 */
export default function MovieDetail() {
  const { id } = useParams();

  // Hook called once at top-level — safe and consistent
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const TMDB_BASE =
    import.meta.env.VITE_TMDB_BASE || "https://api.themoviedb.org/3";
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  // reviews (full list)
  const [reviews, setReviews] = useState([]);
  // pagination: how many reviews to show initially / increment
  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // UI states for sync
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  // recommended movies (TMDB similar)
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // load TMDB details
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const d = await fetchMovieDetails(id);
        const details = d.details || {};
        const mapped = {
          id: String(details.id),
          title: details.title,
          posterUrl: details.poster_path
            ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w500${
                details.poster_path
              }`
            : import.meta.env.VITE_PLACEHOLDER_URL,
          overview: details.overview || "No overview available.",
          releaseYear: details.release_date
            ? new Date(details.release_date).getFullYear()
            : "",
          runtime: details.runtime || null,
          genres: (details.genres || []).map((g) => g.name),
          // keep profile_path so we can render thumbnails
          cast: (d.credits?.cast || []).slice(0, 8).map((c) => ({
            name: c.name,
            character: c.character,
            profile_path: c.profile_path || null,
          })),
          trailer:
            (d.videos?.results || []).find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            )?.key || null,
        };
        if (mounted) setMovie(mapped);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load movie");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // load reviews from backend and local fallback
  useEffect(() => {
    let mounted = true;
    async function loadReviews() {
      let list = [];
      try {
        if (base) {
          const res = await fetch(`${base}/movies/${id}/reviews`);
          if (res.ok) {
            const json = await res.json();
            list = Array.isArray(json) ? json : json?.reviews || [];
          }
        }
      } catch (e) {
        // ignore backend error, fallback to local
        console.error("Failed fetch backend reviews", e);
      } finally {
        // append local fallback reviews for this movie (localReviews)
        try {
          const local = JSON.parse(
            localStorage.getItem("localReviews") || "[]"
          );
          const forThis = (local || []).filter(
            (r) => String(r.movieId) === String(id)
          );
          // show local ones first (recent)
          list = [...forThis, ...(list || [])];
        } catch (errLocal) {
          console.error("Failed to parse localReviews", errLocal);
        }
        if (mounted) {
          setReviews(list);
          setVisibleCount(PAGE_SIZE);
        }
      }
    }

    loadReviews();
    return () => {
      mounted = false;
    };
  }, [id, base]);

  // Recommended (TMDB similar) — simple fetch using TMDB API (client-side)
  useEffect(() => {
    let mounted = true;
    async function loadRecommended() {
      if (!TMDB_KEY) return;
      setRecLoading(true);
      try {
        const url = `${TMDB_BASE}/movie/${id}/similar?api_key=${TMDB_KEY}&page=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB ${res.status}`);
        const data = await res.json();
        const mapped = (data.results || []).slice(0, 6).map((r) => ({
          id: String(r.id),
          title: r.title || r.name,
          posterUrl: r.poster_path
            ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w342${r.poster_path}`
            : import.meta.env.VITE_PLACEHOLDER_URL,
        }));
        if (mounted) setRecommended(mapped);
      } catch (e) {
        console.error("Failed load recommended:", e);
      } finally {
        if (mounted) setRecLoading(false);
      }
    }

    loadRecommended();
    return () => {
      mounted = false;
    };
  }, [id, TMDB_BASE, TMDB_KEY]);

  // handle adding a new review (from ReviewForm)
  function handleNewReview(newReview) {
    setReviews((prev) => [newReview, ...(prev || [])]);
    // ensure the new review is visible
    setVisibleCount((v) => Math.max(v, 1));
  }

  // computed stats for side panel
  const { avgRating, totalReviews, counts } = useMemo(() => {
    const arr = reviews || [];
    const numeric = arr
      .map((r) => Number(r.rating))
      .filter((n) => Number.isFinite(n));
    const total = numeric.length;
    const avg =
      total === 0
        ? null
        : Number((numeric.reduce((a, b) => a + b, 0) / total).toFixed(1));
    const countsMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    numeric.forEach((n) => {
      const k = Math.min(5, Math.max(1, Math.round(n)));
      countsMap[k] = (countsMap[k] || 0) + 1;
    });
    return {
      avgRating: avg,
      totalReviews: total,
      counts: countsMap,
    };
  }, [reviews]);

  // Visible slice of reviews for pagination UI
  const visibleReviews = (reviews || []).slice(0, visibleCount);

  // "Load more" handler
  function loadMoreReviews() {
    setVisibleCount((v) => Math.min((reviews || []).length, v + PAGE_SIZE));
  }

  // Sync localReviews for this movie -> backend (attempt POST); visible only if user is logged in
  async function syncLocalReviews() {
    setSyncing(true);
    setSyncMsg(null);

    try {
      const raw = localStorage.getItem("localReviews");
      if (!raw) {
        setSyncMsg("No local reviews to sync.");
        setSyncing(false);
        return;
      }
      const allLocal = JSON.parse(raw);
      if (!Array.isArray(allLocal) || allLocal.length === 0) {
        setSyncMsg("No local reviews to sync.");
        setSyncing(false);
        return;
      }

      // only take those belonging to this movie
      const toSync = allLocal.filter((r) => String(r.movieId) === String(id));
      if (toSync.length === 0) {
        setSyncMsg("No local reviews for this movie.");
        setSyncing(false);
        return;
      }

      const successIds = [];
      for (const r of toSync) {
        try {
          const res = await fetch(`${base}/movies/${id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              rating: Number(r.rating),
              comment: r.comment,
            }),
          });
          if (!res.ok) {
            // continue to try others
            console.warn("Sync review failed:", await res.text());
            continue;
          }
          const json = await res.json();
          successIds.push(r.id || r.createdAt || JSON.stringify(r));
          setReviews((prev) => [json, ...(prev || [])]);
        } catch (err) {
          console.error("Failed posting review", err);
        }
      }

      // remove synced reviews from localStorage
      const remaining = allLocal.filter(
        (r) => !successIds.includes(r.id || r.createdAt || JSON.stringify(r))
      );
      localStorage.setItem("localReviews", JSON.stringify(remaining));
      setSyncMsg(`Synced ${successIds.length} review(s).`);
    } catch (err) {
      console.error("Sync failed:", err);
      setSyncMsg("Sync failed, see console.");
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <div className="py-20 text-center">Loading movie…</div>;
  if (err)
    return (
      <div className="py-12 text-center text-red-600">
        Error: {err}{" "}
        <div className="mt-4">
          <Link to="/" className="underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  if (!movie) return <div className="py-20 text-center">Movie not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
      {/* Main column */}
      <div>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full md:w-56 rounded object-cover shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight">
              {movie.title}{" "}
              <span className="text-sm text-slate-500">
                ({movie.releaseYear})
              </span>
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {avgRating !== null ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-50 text-yellow-800 font-semibold">
                  <span>{avgRating} ★</span>
                  <span className="text-sm text-slate-500">
                    ({totalReviews})
                  </span>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No ratings yet</div>
              )}

              <div className="text-sm text-slate-600">
                {movie.genres?.length ? movie.genres.join(", ") + " · " : ""}
                {movie.runtime ? `${movie.runtime}m` : ""}
              </div>
            </div>

            <p className="mt-4 text-slate-700">{movie.overview}</p>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Top Cast</h4>

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {movie.cast.map((c, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <img
                        src={
                          c.profile_path
                            ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w92${
                                c.profile_path
                              }`
                            : "/avatars/placeholder.png"
                        }
                        className="w-12 h-12 object-cover rounded"
                        alt={c.name}
                      />
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-slate-500">
                          {c.character}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {movie.trailer && (
          <div className="aspect-video w-full rounded overflow-hidden mt-6">
            <iframe
              title="trailer"
              src={`https://www.youtube.com/embed/${movie.trailer}`}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Reviews area */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reviews</h2>

            <div className="flex items-center gap-3">
              {/* Sync button: visible only if user exists */}
              {user ? (
                <button
                  onClick={syncLocalReviews}
                  disabled={syncing}
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
                >
                  {syncing ? "Syncing…" : "Sync local reviews"}
                </button>
              ) : null}
              {syncMsg ? (
                <div className="text-sm text-slate-500">{syncMsg}</div>
              ) : null}
            </div>
          </div>

          {/* Review form (full width) */}
          <div className="mb-6">
            <ReviewForm
              movieId={id}
              onSuccess={handleNewReview}
              user={user}
              isLoggedIn={!!user}
            />
          </div>

          {/* Reviews list (paginated) */}
          <div className="space-y-4">
            {visibleReviews.length === 0 ? (
              <div className="text-slate-500">
                No reviews yet — be the first to review.
              </div>
            ) : (
              visibleReviews.map((r) => (
                <div
                  key={r._id || r.id || r.createdAt || Math.random()}
                  className="bg-white p-4 rounded-md shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {r.username || r.userId || "Guest"}{" "}
                        <span className="text-sm text-slate-500">
                          •{" "}
                          {r.date ||
                            (r.createdAt ? r.createdAt.split?.("T")?.[0] : "")}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 mt-2">
                        {r.comment}
                      </div>
                    </div>
                    <div className="text-lg font-semibold">{r.rating}★</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* load more */}
          {visibleCount < (reviews || []).length ? (
            <div className="mt-4 text-center">
              <button
                onClick={loadMoreReviews}
                className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                Load more reviews
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {/* Side panel */}
      <aside className="space-y-6">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-semibold mb-2">Ratings breakdown</h3>
          <div className="text-sm text-slate-700 mb-2">
            {totalReviews > 0 ? `${totalReviews} review(s)` : "No reviews yet"}
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const c = counts?.[star] || 0;
              const percent =
                totalReviews === 0 ? 0 : Math.round((c / totalReviews) * 100);
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="w-8 text-sm">{star}★</div>
                  <div className="flex-1 bg-slate-100 rounded h-3 overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-3 bg-yellow-400"
                    />
                  </div>
                  <div className="w-10 text-sm text-right">{c}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Recommended</h3>
            {recLoading ? (
              <span className="text-sm text-slate-500">loading…</span>
            ) : null}
          </div>

          {recommended.length === 0 ? (
            <div className="text-sm text-slate-500">No recommendations</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recommended.map((m) => (
                <Link to={`/movies/${m.id}`} key={m.id} className="block">
                  <div className="rounded overflow-hidden bg-slate-50 shadow-sm">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="p-2 text-sm font-medium">{m.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-3 text-center">
            <Link to="/" className="text-sm text-blue-600 underline">
              Browse more
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm text-sm text-slate-600">
          <h4 className="font-semibold mb-2">Notes</h4>
          <p>
            Local reviews are saved to your browser when backend POST isn't
            possible. Use <strong>Sync local reviews</strong> after signing in
            to try sending them to the server.
          </p>
        </div>
      </aside>
    </div>
  );
}
