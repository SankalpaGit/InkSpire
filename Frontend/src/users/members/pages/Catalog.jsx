import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";
import MemberLayout from "../layout/MemberLayout";
import axios from "axios";

const sortOptions = [
  { label: "Title (A-Z)", value: "title-asc" },
  { label: "Title (Z-A)", value: "title-desc" },
  { label: "Publish Date (Newest)", value: "date-desc" },
  { label: "Publish Date (Oldest)", value: "date-asc" },
];

const formats = ["Hardcover", "Paperback", "E-book"];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {[...Array(full)].map((_, i) => (
        <AiFillStar key={`f-${i}`} />
      ))}
      {half && <FaStarHalfAlt />}
      {[...Array(empty)].map((_, i) => (
        <AiOutlineStar key={`e-${i}`} />
      ))}
    </div>
  );
};

const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [priceFilter, setPriceFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [formatFilter, setFormatFilter] = useState([]);

  const booksPerPage = 6;

  const fetchAverageRating = async (bookId) => {
    try {
      const response = await axios.get(
        `http://localhost:5106/api/review/average-rating/${bookId}`
      );
      return response.data.AverageRating || 0;
    } catch (error) {
      return 0;
    }
  };

  const fetchBooks = async (query = "") => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const url = query
      ? `http://localhost:5106/api/SearchBook/search?query=${encodeURIComponent(
        query
      )}`
      : `http://localhost:5106/api/ViewBook/all?pageNumber=1&pageSize=100`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = query ? response.data : response.data.books;
      const ratedBooks = await Promise.all(
        fetched.map(async (book) => {
          const avgRating = await fetchAverageRating(book.bookId);
          return {
            id: book.bookId,
            title: book.title || "Unknown Title",
            author: book.author || "Unknown Author",
            price: book.price || 0,
            rating: avgRating,
            inStore: book.isAvailableInStore || false,
            format:
              book.format === "Softcopy"
                ? "Paperback"
                : book.format || "Unknown Format",
            published: book.publicationDate
              ? book.publicationDate.split("T")[0]
              : "2000-01-01",
            image: book.coverImage
              ? `http://localhost:5106/${book.coverImage}`
              : "/default-cover.jpg",
          };
        })
      );

      setBooks(ratedBooks);
      setTotalBooks(ratedBooks.length);
    } catch (err) {
      setError("Failed to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(search);
  }, [search]);

  const applyFilters = (books) => {
    return books.filter((book) => {
      const ratingOk =
        ratingFilter.length === 0 ||
        ratingFilter.some((range) => {
          if (range === "1-2") return book.rating >= 1 && book.rating <= 2;
          if (range === "3-4") return book.rating > 2 && book.rating <= 4;
          if (range === "5") return book.rating > 4;
          return true;
        });

      const priceOk =
        priceFilter.length === 0 ||
        priceFilter.some((range) => {
          if (range === "0-500") return book.price >= 0 && book.price <= 20;
          if (range === "501-800") return book.price > 20 && book.price <= 50;
          if (range === "800+") return book.price > 50;
          return true;
        });


      const availabilityOk =
        availabilityFilter.length === 0 ||
        (availabilityFilter.includes("in") && book.inStore) ||
        (availabilityFilter.includes("out") && !book.inStore);

      const formatOk =
        formatFilter.length === 0 || formatFilter.includes(book.format);

      return ratingOk && availabilityOk && formatOk && priceOk;
    });
  };

  const filteredBooks = applyFilters(books);

  const sortedBooks = filteredBooks.sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);
    if (sort === "date-asc")
      return new Date(a.published) - new Date(b.published);
    if (sort === "date-desc")
      return new Date(b.published) - new Date(a.published);
    return 0;
  });

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const toggleFilter = (value, setFunc, state) => {
    setFunc(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
    setCurrentPage(1);
  };

  return (
    <MemberLayout>
      <div className="min-h-screen bg-white p-6">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by ISBN, Title, Description of book..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/3 shadow-sm"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-40 shadow-sm"
          >
            <option value="">Sort By</option>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-xl shadow space-y-6 h-fit">
            <h4 className="font-semibold text-lg text-gray-800 mb-2">
              Filters
            </h4>
            {/* Price */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Price Range</h4>
              {["0-500", "501-800", "800+"].map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-600 rounded"
                    onChange={() => toggleFilter(p, setPriceFilter, priceFilter)}
                    checked={priceFilter.includes(p)}
                  />
                  {p === "0-500"
                    ? "$0 - $500"
                    : p === "501-800"
                      ? "$501 - $800"
                      : "$800+"}
                </label>
              ))}
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Rating</h4>
              {["1-2", "3-4", "5"].map((r) => (
                <label key={r} className="flex items-center gap-2 mb-1 text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-600 rounded"
                    onChange={() => toggleFilter(r, setRatingFilter, ratingFilter)}
                    checked={ratingFilter.includes(r)}
                  />
                  <span className="text-gray-700">{r}</span>
                  <AiFillStar className="text-yellow-500 text-xl" />
                </label>
              ))}
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Availability</h4>
              {["in", "out"].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-600 rounded"
                    onChange={() =>
                      toggleFilter(type, setAvailabilityFilter, availabilityFilter)
                    }
                    checked={availabilityFilter.includes(type)}
                  />
                  {type === "in" ? "In Store" : "Not Available"}
                </label>
              ))}
            </div>

            {/* Format */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Format</h4>
              {formats.map((f) => (
                <label key={f} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-600 rounded"
                    onChange={() => toggleFilter(f, setFormatFilter, formatFilter)}
                    checked={formatFilter.includes(f)}
                  />
                  {f}
                </label>
              ))}
            </div>

            <button
              className="w-full bg-red-500 text-white py-2 rounded"
              onClick={() => {
                setRatingFilter([]);
                setAvailabilityFilter([]);
                setFormatFilter([]);
                setCurrentPage(1);
              }}
            >
              Clear All
            </button>
          </div>

          {/* Books Grid */}
          <div className="w-full lg:w-3/4">
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            {loading && <p className="text-gray-600 text-center">Loading books...</p>}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedBooks.length === 0 ? (
                  <p className="text-gray-600 col-span-full">No books found.</p>
                ) : (
                  paginatedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white p-4 rounded-xl shadow border border-gray-200"
                    >
                      <Link to={`/book/${book.id}`}>
                        <div className="bg-red-50 h-96 w-full flex items-center justify-center mb-4">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-cover.jpg";
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                        <div className="flex items-center justify-between">
                          {renderStars(book.rating)}
                          <p className="text-indigo-600 font-bold mt-1">
                            ${book.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded ${currentPage === i + 1
                      ? "bg-[#112742] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProductPage;