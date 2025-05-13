import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // If you're using React Router

const FeaturedBooks = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'All', endpoint: 'random-books' },
    { name: 'Best Sales', endpoint: 'best-sellers' },
    { name: 'New Release', endpoint: 'recently-published' },
    { name: 'Award Winning', endpoint: 'award-winning' },
    { name: 'Latest Added', endpoint: 'recently-created' },
  ];

  const fetchBooks = async (endpoint) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5106/api/BookCategories/${endpoint}`);
      setBooks(response.data?.books ?? []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultCategory = categories.find(c => c.name === selectedCategory);
    if (defaultCategory) {
      fetchBooks(defaultCategory.endpoint);
    }
  }, [selectedCategory]);

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '/default-cover.jpg';
    return `http://localhost:5106/${coverImage.replace(/\\/g, '/')}`;
  };

  const renderStars = (rating = 4) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar key={i} size={16} color={i < rating ? '#FBBF24' : '#D1D5DB'} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 ">Featured Books</h2>

      <div className="flex p-1 mb-6 gap-4 bg-gray-100 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${selectedCategory === category.name
                ? 'bg-[#112742] text-white'
                : 'text-gray-700 hover:bg-gray-300'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center text-red-500">No books available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.bookId}
              className="bg-white p-4 rounded-xl shadow border border-gray-300 transition-all h-fit"
            >
              <Link to={`/book/${book.bookId}`}>
                <div className="bg-gray-100 h-96 w-full flex items-center justify-center mb-4">
                  <img
                    src={getImageUrl(book.coverImage)}
                    alt={book.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-cover.jpg';
                    }}
                  />
                </div>

                <h3 className="font-semibold text-lg text-gray-800 hover:text-indigo-600 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{book.author}</p>

                <div className="flex items-center justify-between mt-2">
                  {renderStars(book.rating)}
                  <p className="text-indigo-600 font-bold">₹{book.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedBooks;
