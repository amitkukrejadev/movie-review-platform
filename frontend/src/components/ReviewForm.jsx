import React, { useState } from "react";

/**
 * Minimal ReviewForm so page/components that import it don't break.
 * Replace submission behavior with an actual API call later.
 */
export default function ReviewForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    setLoading(true);
    try {
      // call parent handler (if provided) to actually post the review
      if (onSubmit) {
        await onSubmit({ text, rating });
      } else {
        // temporary: just log
        console.log("submit review", { text, rating });
      }
      setText("");
      setRating(5);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 block w-28 rounded border px-2 py-1"
        >
          {[5,4,3,2,1].map((r) => (
            <option value={r} key={r}>
              {r} star{r>1 ? "s":""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded border px-2 py-1"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Posting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
}
