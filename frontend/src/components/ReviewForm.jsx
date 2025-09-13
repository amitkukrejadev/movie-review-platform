import React, { useEffect, useState } from "react";

/**
 * Minimal review form that uses movieId so the prop is actually used
 * (avoids unused var warnings). For now we store the last submission in
 * localStorage for demo purposes.
 */
export default function ReviewForm({ movieId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(() => {
    try {
      const raw = localStorage.getItem("lastReview");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // if lastSubmission pertains to this movie, keep it visible
    if (lastSubmission && lastSubmission.movieId !== movieId) {
      // leave it — it's harmless; we purposely keep last submission global
    }
  }, [movieId, lastSubmission]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setOk(null);

    // simulate network delay / posting to backend
    await new Promise((r) => setTimeout(r, 500));

    const payload = {
      movieId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lastReview", JSON.stringify(payload));
      setLastSubmission(payload);
      setOk(true);
      setComment("");
      setRating(5);
    } catch (err) {
      setOk(false);
      // eslint-disable-next-line no-console
      console.error("Failed to save review locally:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
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
        </div>

        <div>
          <label className="text-sm block mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full border rounded p-2"
            placeholder="Write a short review..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {sending ? "Submitting..." : "Submit Review"}
          </button>

          {ok === true && (
            <span className="ml-3 text-green-600">
              Thanks — review saved locally.
            </span>
          )}
          {ok === false && (
            <span className="ml-3 text-red-600">Failed to save review.</span>
          )}
        </div>
      </form>

      {lastSubmission && (
        <div className="mt-3 text-sm text-green-700">
          Last saved review for <strong>{lastSubmission.movieId}</strong> —{" "}
          {lastSubmission.rating}★
        </div>
      )}
    </div>
  );
}
