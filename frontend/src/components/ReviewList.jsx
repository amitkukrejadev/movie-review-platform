// frontend/src/components/ReviewList.jsx
import React from "react";

function renderComment(text) {
  if (!text) return null;

  // handle lists: lines starting with "- "
  const lines = text.split("\n");
  const listLines = lines.filter((l) => l.trim().startsWith("- "));
  const hasList = listLines.length > 0 && listLines.length === lines.length;

  if (hasList) {
    const items = lines.map((l) => l.replace(/^\s*-\s*/, "").trim());
    return (
      <ul className="list-disc pl-5">
        {items.map((it, i) => (
          <li key={i}>{renderInline(it)}</li>
        ))}
      </ul>
    );
  }

  // fallback: break into paragraphs
  return lines.map((line, idx) => (
    <p key={idx} className="mb-2">
      {renderInline(line)}
    </p>
  ));
}

function renderInline(text) {
  // escape
  const esc = (s) =>
    s.replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  let t = esc(text);

  // bold: **text**
  const partsBold = t.split(/\*\*(.+?)\*\*/g);
  if (partsBold.length > 1) {
    return partsBold.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{renderInline(part)}</strong> : part
    );
  }
  // italic: *text*
  const partsItalic = t.split(/\*(.+?)\*/g);
  if (partsItalic.length > 1) {
    return partsItalic.map((part, i) =>
      i % 2 === 1 ? <em key={i}>{part}</em> : part
    );
  }
  return t;
}

function ReviewItem({ r }) {
  const isLocal = !!(r.id && String(r.id).startsWith("local-")) || r._local;
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="font-medium">{r.username || "Guest"}</div>
            <div className="text-xs text-slate-400">
              {r.date || r.createdAt?.split?.("T")?.[0] || ""}
            </div>
            {isLocal && (
              <div className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Local
              </div>
            )}
          </div>
          <div className="text-yellow-600 font-semibold mt-2">{r.rating} ★</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {renderComment(r.comment)}
      </div>
    </div>
  );
}

export default function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-slate-500">
        No reviews yet — be the first to review.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem
          key={
            r.id ||
            r._id ||
            `${r.movieId}-${r.createdAt || r.date || Math.random()}`
          }
          r={r}
        />
      ))}
    </div>
  );
}
