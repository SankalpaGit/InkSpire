import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !bookId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5106/api/Review/reviews/${bookId}`
        );
        const reviewData = response.data;

        if (Array.isArray(reviewData.reviews)) {
          setReviews(reviewData.reviews);
        } else {
          console.warn("Unexpected reviews format:", reviewData);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const renderStars = (count) => (
    <div className="flex space-x-0.5 text-yellow-400 text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < count ? "★" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          Book Reviews
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="border rounded-xl p-4 shadow-md bg-gray-50 transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  {renderStars(review.rating)}
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{review.comments}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
