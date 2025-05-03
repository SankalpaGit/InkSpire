import React, { useState } from 'react';
import {
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';
import { FaStarHalfAlt } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import MemberLayout from '../layout/MemberLayout';

const dummyBookmarks = [
  {
    id: 1,
    title: 'Alpha Book',
    author: 'Author A',
    price: 19.99,
    rating: 4.5,
    format: 'Hardcover',
    published: '2022-05-01',
  },
  {
    id: 2,
    title: 'Beta Book',
    author: 'Author B',
    price: 14.99,
    rating: 3,
    format: 'E-book',
    published: '2021-08-15',
  },
  {
    id: 3,
    title: 'Gamma Book',
    author: 'Author C',
    price: 24.5,
    rating: 5,
    format: 'Softcopy',
    published: '2023-01-10',
  },
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {[...Array(full)].map((_, i) => <AiFillStar key={`f-${i}`} />)}
      {half && <FaStarHalfAlt />}
      {[...Array(empty)].map((_, i) => <AiOutlineStar key={`e-${i}`} />)}
    </div>
  );
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(dummyBookmarks);

  const handleDelete = (id) => {
    setBookmarks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleAddToCart = (book) => {
    console.log(`Added to cart:`, book);
    // You can integrate your cart logic here
  };

  return (
    <MemberLayout>
      <div className="min-h-screen bg-white p-6">
        <h2 className="text-2xl font-bold text-[#112742] mb-6">Your Bookmarks</h2>

        {bookmarks.length === 0 ? (
          <p className="text-gray-600 text-center mt-20 text-lg">You have no bookmarked books yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all h-fit relative"
              >
                <div className="h-52 bg-gray-200 mb-4 rounded" />
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {book.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Remove Bookmark"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                <div className="flex items-center justify-between">
                  {renderStars(book.rating)}
                  <p className="text-indigo-600 font-bold mt-1">${book.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(book)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <IoCartOutline className="text-xl" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default Bookmarks;
