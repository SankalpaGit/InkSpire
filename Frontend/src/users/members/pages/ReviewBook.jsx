import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MemberLayout from '../layout/MemberLayout';

const ReviewBook = () => {
  const { bookId } = useParams(); // Get bookId from URL
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('You must be logged in to submit a review.');
        setIsError(true);
        return;
      }

      const payload = {
        bookId: bookId,
        rating: parseInt(rating),
        comment: reviewText,
      };

      const response = await axios.post(
        'http://localhost:5106/api/review/review',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.Message || 'Review submitted successfully.');
      setIsError(false);
      setRating('');
      setReviewText('');
    } catch (error) {
      setMessage(
        error.response?.data?.Message || 'An error occurred while submitting the review.'
      );
      setIsError(true);
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-2xl mt-12">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-indigo-600 to-[#112742] text-transparent bg-clip-text">
          Share Your Review
        </h2>

        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              isError ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-1">
              Your Rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Rating</option>
              <option value="1">1 ★</option>
              <option value="2">2 ★★</option>
              <option value="3">3 ★★★</option>
              <option value="4">4 ★★★★</option>
              <option value="5">5 ★★★★★</option>
            </select>
          </div>

          <div>
            <label htmlFor="reviewText" className="block text-sm font-semibold text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="reviewText"
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your honest thoughts about the book..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>
    </MemberLayout>
  );
};

export default ReviewBook;
