// frontend/src/components/ReviewForm.jsx
import React, { useState, useEffect } from "react";

/**
 * Props:
 * - movieId (required)
 * - onSuccess(review) optional callback to update UI
 * - user (optional) object if you have user info in parent (id, username, email)
 * - isLoggedIn (optional) boolean — if true show Sync Local Reviews etc (parent supplies)
 */
export default function ReviewForm({ movieId, onSuccess, user, isLoggedIn }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // guest fields shown when user chooses "Post as guest"
  const [guestMode, setGuestMode] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [hasLocalReviews, setHasLocalReviews] = useState(false);

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // === restore draft if present (sessionStorage) ===
  useEffect(() => {
    const raw = sessionStorage.getItem(`review-draft-${movieId}`);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d.comment) setComment(d.comment);
        if (d.rating) setRating(d.rating);
        sessionStorage.removeItem(`review-draft-${movieId}`);
      } catch {
        // ignore parse errors
      }
    }
  }, [movieId]);

  useEffect(() => {
    const local = localStorage.getItem("localReviews");
    setHasLocalReviews(local && JSON.parse(local).length > 0);
  }, []);

  // helper to escape HTML for preview
  function escapeHtml(str) {
    return String(str || "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );
  }

  // compute preview HTML (very small subset of markdown-ish formatting)
  const previewHtml = escapeHtml(comment)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");

  // insertion helper that wraps selection in the textarea
  function insertAroundSelection(marker) {
    const textarea = document.getElementById(`review-textarea-${movieId}`);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // use latest comment state
    const before = comment.slice(0, start);
    const sel = comment.slice(start, end);
    const after = comment.slice(end);
    const replaced = `${before}${marker}${sel}${marker}${after}`;
    setComment(replaced);
    // restore selection around original text (schedule after state update)
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + marker.length;
      textarea.selectionEnd = end + marker.length;
    }, 0);
  }

  // Save draft to sessionStorage before navigating away (call where appropriate)
  function saveDraftToSession() {
    try {
      sessionStorage.setItem(
        `review-draft-${movieId}`,
        JSON.stringify({ rating, comment })
      );
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const payload = {
      rating: Number(rating),
      comment: comment.trim(),
    };

    // include username/email if available (user or guest)
    if (user && user.username) {
      payload.username = user.username;
      payload.userId = user.id;
      if (user.email) payload.email = user.email;
    } else if (guestMode) {
      payload.username = guestName || "Guest";
      if (guestEmail) payload.email = guestEmail;
    }

    // optimistic local review object
    const localReview = {
      id: `local-${Date.now()}`,
      movieId,
      userId: payload.userId || null,
      username: payload.username || "Guest",
      rating: payload.rating,
      comment: payload.comment,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      synced: false,
    };

    try {
      if (base) {
        const res = await fetch(`${base}/movies/${movieId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          if (onSuccess) onSuccess(json);
          setComment("");
          setRating(5);
          setGuestMode(false);
          setGuestEmail("");
          setGuestName("");
          setSending(false);
          return;
        }
        // if server responded non-2xx fall through to fallback
        throw new Error(`status ${res.status}`);
      } else {
        throw new Error("no backend configured");
      }
    } catch (err) {
      setError(err.message);
      console.error("POST /movies/:id/reviews error:", err);
      // fallback: save locally
      try {
        const existing = JSON.parse(
          localStorage.getItem("localReviews") || "[]"
        );
        existing.unshift(localReview);
        localStorage.setItem("localReviews", JSON.stringify(existing));
        if (onSuccess) onSuccess(localReview);
        setComment("");
        setRating(5);
        setGuestMode(false);
        setHasLocalReviews(true); // we have local reviews now
      } catch (err2) {
        setError("Failed to save review");
        console.error("Review fallback failed:", err2);
      } finally {
        setSending(false);
      }
    }
  }

  // Helper to sync local reviews (used by a separate "Sync" button)
  async function syncLocalReviews(signal) {
    if (!isLoggedIn) return { success: false, message: "Not logged in" };

    const local = JSON.parse(localStorage.getItem("localReviews") || "[]");
    if (!local.length) return { success: true, message: "No local reviews" };
    const results = [];
    for (const r of local.slice()) {
      try {
        const res = await fetch(`${base}/movies/${r.movieId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: r.rating,
            comment: r.comment,
            username: r.username || "Guest",
          }),
          credentials: "include",
          signal,
        });
        if (res.ok) {
          results.push(await res.json());
        }
      } catch (e) {
        console.error("Sync one review failed:", e);
      }
    }
    // remove local copy after attempts (or refine to remove only succeeded)
    localStorage.removeItem("localReviews");
    setHasLocalReviews(false);
    return { success: true, results };
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-md shadow-sm space-y-3"
    >
      <div className="flex items-center gap-3">
        <label className="text-sm">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>

        {/* toolbar */}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={() => insertAroundSelection("**")}
            title="Bold (Markdown)"
          >
            B
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={() => insertAroundSelection("_")}
            title="Italic (Markdown)"
          >
            I
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={() => insertAroundSelection("`")}
            title="Code"
          >
            {"</>"}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm block mb-1">Comment</label>
        <textarea
          id={`review-textarea-${movieId}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full border rounded p-2"
          placeholder="Write a short review..."
          required
        />
        {/* formatted preview using sanitized HTML */}
        {comment && (
          <div className="mt-2 text-sm text-slate-700">
            <strong>Preview:</strong>
            <div
              className="prose mt-1 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </div>

      {!user && !guestMode && (
        <div className="text-sm">
          <em>You are not signed in.</em>{" "}
          <button
            type="button"
            onClick={() => {
              // save draft then navigate/prompt
              saveDraftToSession();
              const wantLogin = window.confirm(
                "You are not signed in. Press OK to go to login/register, Cancel to post as guest."
              );
              if (wantLogin) {
                window.location.href = `/login?redirect=${encodeURIComponent(
                  window.location.pathname
                )}`;
              } else {
                setGuestMode(true);
              }
            }}
            className="underline text-blue-600"
          >
            Login or Post as guest
          </button>
        </div>
      )}

      {guestMode && !user && (
        <div className="space-y-2">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            className="w-full px-2 py-1 border rounded"
          />
          <input
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-2 py-1 border rounded"
          />
          <div className="text-sm text-slate-500">
            Your review will be posted as:{" "}
            <strong>{guestName || "Guest"}</strong>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {sending ? "Submitting..." : "Submit Review"}
        </button>
        {isLoggedIn && hasLocalReviews && (
          <button
            type="button"
            onClick={async () => {
              setSyncing(true);
              setSyncMessage("");
              const res = await syncLocalReviews();
              setSyncing(false);
              if (res.success) {
                setSyncMessage(`Synced ${res.results.length} review(s).`);
                // Optionally, refresh parent list
                if (onSuccess && res.results.length > 0) {
                  res.results.forEach(onSuccess);
                }
              } else {
                setSyncMessage(res.message || "Sync failed.");
              }
            }}
            disabled={syncing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
          >
            {syncing ? "Syncing..." : "Sync Local Reviews"}
          </button>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {syncMessage && (
          <div className="text-green-600 text-sm">{syncMessage}</div>
        )}
      </div>
    </form>
  );
}
