import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import MemberLayout from "../layout/MemberLayout";
import axios from "axios";

const sortOptions = [
  { label: "Title (A-Z)", value: "title-asc" },
  { label: "Title (Z-A)", value: "title-desc" },
  { label: "Publish Date (Newest)", value: "date-desc" },
  { label: "Publish Date (Oldest)", value: "date-asc" },
];

// Fix duplicate Paperback
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
  const [priceRange, setPriceRange] = useState(50);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]); // Store books from API
  const [totalBooks, setTotalBooks] = useState(0); // Store total books for pagination
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Store error message

  const booksPerPage = 6;

  // Fetch books from backend
  const fetchBooks = () => {
    // Set loading state
    setLoading(true);
    setError(""); // Clear previous errors

    const token = localStorage.getItem("token");
    if (!token) {
      // Set error for missing token
      setError("Please log in to browse books.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5106/api/ViewBook/all?pageNumber=1&pageSize=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Map backend books to match frontend structure
        const fetchedBooks = response.data.books.map((book) => ({
          id: book.bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          rating: book.rating || 0, // Fallback to 0 if rating is missing
          inStore: book.isAvailableInStore,
          format: book.format === "Softcopy" ? "Paperback" : book.format, // Map Softcopy to Paperback
          published: book.publicationDate
            ? book.publicationDate.split("T")[0]
            : "2000-01-01", // Fallback date
          image: book.coverImage
            ? `http://localhost:5106/${book.coverImage}`
            : "/default-cover.jpg", // Use Uploads folder
        }));

        // Set books and total books
        setBooks(fetchedBooks);
        setTotalBooks(response.data.totalBooks);
        console.log("Books fetched:", fetchedBooks);
      })
      .catch((error) => {
        // Set error message for API failure
        console.error("Error fetching books:", error);
        if (error.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          setTimeout(() => (window.location.href = "/login"), 2000);
        } else {
          setError("Unable to load books. Please try again later.");
        }
        setBooks([]); // Clear books on error
      })
      .finally(() => {
        // Clear loading state
        setLoading(false);
      });
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleCheckbox = (value, list, setList) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const clearFilters = () => {
    setPriceRange(50);
    setSelectedRatings([]);
    setAvailability([]);
    setSelectedFormats([]);
    setCurrentPage(1);
  };

  const filteredBooks = books
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => b.price <= priceRange)
    .filter((b) => {
      if (selectedRatings.includes("1-2") && b.rating >= 1 && b.rating < 3)
        return true;
      if (selectedRatings.includes("3-4") && b.rating >= 3 && b.rating < 5)
        return true;
      if (selectedRatings.includes("5") && b.rating === 5) return true;
      if (selectedRatings.length === 0) return true;
      return false;
    })
    .filter((b) =>
      availability.length
        ? availability.includes(b.inStore ? "in" : "out")
        : true
    )
    .filter((b) =>
      selectedFormats.length ? selectedFormats.includes(b.format) : true
    )
    .sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "date-asc")
        return new Date(a.published) - new Date(b.published);
      if (sort === "date-desc")
        return new Date(b.published) - new Date(a.published);
      return 0;
    });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-xl shadow space-y-6 h-fit">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800 text-lg">Filters</h4>
            </div>

            {/* Price */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">
                Price Range (Up to ${priceRange})
              </h4>
              <input
                type="range"
                min="0"
                max="1000" // Reverted to original max
                step="1"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-3 rounded-lg cursor-pointer bg-indigo-200"
              />
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Rating</h4>
              {["1-2", "3-4", "5"].map((r) => (
                <label key={r} className="flex items-center gap-2 mb-1 text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500"
                    checked={selectedRatings.includes(r)}
                    onChange={() => {
                      toggleCheckbox(r, selectedRatings, setSelectedRatings);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="text-gray-700">{r}</span>
                  <AiFillStar className="text-yellow-500 text-2xl" />
                </label>
              ))}
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Availability</h4>
              <div className="space-y-1 text-sm">
                {["in", "out"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500"
                      checked={availability.includes(type)}
                      onChange={() => {
                        toggleCheckbox(type, availability, setAvailability);
                        setCurrentPage(1);
                      }}
                    />
                    {type === "in" ? "In Store" : "Not Available"}
                  </label>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Format</h4>
              <div className="space-y-1 text-sm">
                {formats.map((f) => (
                  <label key={f} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500"
                      checked={selectedFormats.includes(f)}
                      onChange={() => {
                        toggleCheckbox(f, selectedFormats, setSelectedFormats);
                        setCurrentPage(1);
                      }}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-all"
            >
              Clear All
            </button>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {/* Show error message if any */}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            {loading && (
              <p className="text-gray-600 text-center">Loading books...</p>
            )}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedBooks.length === 0 ? (
                  <p className="text-gray-600 col-span-full">No books found.</p>
                ) : (
                  paginatedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all h-fit"
                    >
                      {/* Display book cover image */}
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-52 w-full object-contain mb-4 rounded"
                        onError={(e) => (e.target.src = "/default-cover.jpg")} // Fallback on error
                      />
                      <h3 className="font-semibold text-lg text-gray-800">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between">
                        {renderStars(book.rating)}
                        <p className="text-indigo-600 font-bold mt-1">
                          ${book.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(book)}
                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <IoCartOutline className="text-xl" />
                        Add to Cart
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === i + 1
                        ? "bg-[#112742] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => changePage(currentPage + 1)}
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
