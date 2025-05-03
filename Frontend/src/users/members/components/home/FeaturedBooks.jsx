import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';
import { FaStarHalfAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const categories = ['All', 'Fiction', 'Non-fiction', 'Sci-fi', 'Romance'];

// Dummy book data with price and rating
const books = [
  { id: 1, title: 'Book Title 1', author: 'Author A', price: 19.99, rating: 4.5 },
  { id: 2, title: 'Book Title 2', author: 'Author B', price: 12.5, rating: 3 },
  { id: 3, title: 'Book Title 3', author: 'Author C', price: 24.99, rating: 5 },
  { id: 4, title: 'Book Title 4', author: 'Author D', price: 14.25, rating: 4 },
  { id: 5, title: 'Book Title 5', author: 'Author E', price: 17.0, rating: 4.5 },
  { id: 6, title: 'Book Title 6', author: 'Author F', price: 22.0, rating: 3.5 },
  { id: 7, title: 'Book Title 7', author: 'Author G', price: 10.0, rating: 2 },
  { id: 8, title: 'Book Title 8', author: 'Author H', price: 18.99, rating: 4 },
];

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <AiFillStar key={`full-${i}`} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(totalStars - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <AiOutlineStar key={`empty-${i}`} />
      ))}
    </div>
  );
};

export const FeaturedBooks = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-16 bg-white ">
      <div className='flex justify-between items-center mb-3'>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Featured Books</h2> 
        <Link to="/catalog">
        <p className='underline font-semibold'>View All</p>
        </Link>
      </div>
 
      <div className="flex p-1 mb-3 gap-4 bg-gray-100 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${activeTab === cat
                ? 'bg-[#112742] text-white'
                : 'text-gray-700 hover:bg-gray-300'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="h-72 bg-gray-200 rounded mb-4"></div>
            <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-1">{book.author}</p>
            {renderStars(book.rating)}
            <p className="text-md font-semibold text-[#112742] mt-2">${book.price.toFixed(2)}</p>
            <button className="mt-4 w-full bg-[#112742e4] text-white py-2 rounded hover:bg-[#112742] transition-all">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
