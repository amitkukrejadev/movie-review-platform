// frontend/src/components/ReviewList.jsx
import React, { useEffect, useState } from "react";

export default function ReviewList({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/movies/${movieId}/reviews`
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [movieId]);

  if (loading)
    return <p className="text-gray-500 text-sm">Loading reviews...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!reviews.length)
    return <p className="text-gray-500 text-sm">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">
              {review.userId?.username || "Anonymous"}
            </span>
            <span className="text-yellow-500 text-sm">{review.rating} ★</span>
          </div>
          <p className="text-gray-700 mt-2 text-sm">{review.comment}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
