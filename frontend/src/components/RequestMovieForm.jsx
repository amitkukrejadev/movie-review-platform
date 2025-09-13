// frontend/src/components/RequestMovieForm.jsx
import React, { useState } from "react";

export default function RequestMovieForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState(null);
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    const payload = {
      title,
      notes,
      rating,
      createdAt: new Date().toISOString(),
    };

    // Try backend at /requests (your backend can add this route)
    try {
      if (base) {
        const res = await fetch(`${base}/requests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        setStatus("ok");
      } else {
        // fallback to localStorage
        const existing = JSON.parse(
          localStorage.getItem("movieRequests") || "[]"
        );
        existing.unshift(payload);
        localStorage.setItem("movieRequests", JSON.stringify(existing));
        setStatus("ok");
      }
      setTitle("");
      setNotes("");
      setRating(5);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Request a movie</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Movie title"
        className="w-full mb-2 px-3 py-2 border rounded"
        required
      />

      <div className="mb-2">
        <label className="text-sm mr-2">Rating</label>
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

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full mb-2 px-3 py-2 border rounded"
      />

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">
          Submit
        </button>
        {status === "submitting" && (
          <span className="text-sm text-slate-500">Submitting…</span>
        )}
        {status === "ok" && (
          <span className="text-sm text-green-600">Submitted — thanks!</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600">Failed — try again.</span>
        )}
      </div>
    </form>
  );
}
