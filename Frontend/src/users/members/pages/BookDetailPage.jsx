import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt, FaBook, FaLanguage, FaCalendar, FaStore, FaBarcode, FaPlus, FaMinus, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoCartOutline, IoBusiness } from "react-icons/io5";
import { MdFormatAlignLeft } from "react-icons/md";
import MemberLayout from "../layout/MemberLayout";
import axios from "axios";

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

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState("");
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view book details.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5106/api/ViewBook/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error("Empty response from API");
      }

      const fetchedBook = {
        title: response.data.title || "Unknown Title",
        author: response.data.author || "Unknown Author",
        description: response.data.description || "No description available.",
        genre: response.data.genre || "Unknown Genre",
        price: response.data.price || 0,
        stockQuantity: response.data.stockQuantity || 0,
        language: response.data.language || "Unknown Language",
        format: response.data.format === "Softcopy" ? "Paperback" : response.data.format || "Unknown Format",
        publisher: response.data.publisher || "Unknown Publisher",
        isbn: response.data.isbn || "N/A",
        image: response.data.coverImage && typeof response.data.coverImage === "string"
          ? `http://localhost:5106/${response.data.coverImage.replace(/\\/g, "/")}`
          : "/default-cover.jpg",
        publicationDate: response.data.publicationDate
          ? response.data.publicationDate.split("T")[0]
          : "2000-01-01",
        isAvailableInStore: response.data.isAvailableInStore || false,
        isExclusiveEdition: response.data.isExclusiveEdition || false,
        rating: response.data.rating || 0,
      };

      setBook(fetchedBook);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 404) {
        setError(`Book with ID ${bookId} not found.`);
      } else {
        setError(`Unable to load book details: ${error.message}`);
      }
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarkStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:5106/api/Bookmark/view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookmarks = response.data.Bookmarks || [];
      const isBookmarked = bookmarks.some(bookmark => bookmark.BookId === bookId);
      setIsBookmarked(isBookmarked);
      console.log(`Fetched bookmark status for book ${bookId}: ${isBookmarked}`);
    } catch (error) {
     
      setTimeout(() => setBookmarkMessage(""), 3000);
    }
  };

  const handleToggleBookmark = async () => {
    if (isBookmarkLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to bookmark this book.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    setIsBookmarkLoading(true);
    try {
      if (isBookmarked) {
        console.log(`Removing bookmark for book ${bookId}`);
        const response = await axios.delete(`http://localhost:5106/api/Bookmark/remove?bookId=${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsBookmarked(false);
        setBookmarkMessage(response.data.Message || "Bookmark removed successfully.");
        console.log(`Bookmark removed for book ${bookId}`);
      } else {
        console.log(`Adding bookmark for book ${bookId}`);
        const response = await axios.post(
          "http://localhost:5106/api/Bookmark/add",
          { BookId: bookId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsBookmarked(true);
        setBookmarkMessage(response.data.Message || "Book bookmarked successfully.");
        console.log(`Bookmark added for book ${bookId}`);
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 400 && error.response.data.Message === "This book is already bookmarked by the member.") {
        setIsBookmarked(true);
        setBookmarkMessage("Book is already bookmarked.");
      } else if (error.response?.status === 400) {
        setBookmarkMessage(error.response.data.Message || "Invalid request.");
      } else if (error.response?.status === 404) {
        setBookmarkMessage(error.response.data.Message || "Bookmark not found.");
        setIsBookmarked(false); // Ensure state is correct if bookmark not found
      } else {
        setBookmarkMessage(`Failed to toggle bookmark: ${error.response?.data?.Message || error.message}`);
      }
    } finally {
      setIsBookmarkLoading(false);
      setTimeout(() => setBookmarkMessage(""), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (!book) {
      setError("No book data available to add to cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to add items to cart.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    if (!bookId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookId)) {
      setError("Invalid book ID format.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5106/api/Cart/add",
        { bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCartMessage(response.data.message || "Book added to cart successfully.");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 404) {
        setError("Book not found in the database.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Not enough stock available.");
      } else {
        setError(`Failed to add to cart: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (!bookId || bookId === "undefined" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookId)) {
      setError("Invalid book ID.");
      return;
    }
    setIsBookmarked(false); // Reset bookmark state when bookId changes
    fetchBook();
    fetchBookmarkStatus();
  }, [bookId]);

  const handleQuantityChange = (change) => {
    if (book) {
      const newQuantity = quantity + change;
      if (newQuantity >= 1 && newQuantity <= book.stockQuantity) {
        setQuantity(newQuantity);
      }
    }
  };

  return (
    <MemberLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/catalog"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-lg mb-6 inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </Link>

          {error && (
            <p className="text-red-600 text-center mb-6 bg-red-100 p-4 rounded-lg">
              {error}
            </p>
          )}

          {cartMessage && (
            <p className="text-green-600 text-center mb-6 bg-green-100 p-4 rounded-lg">
              {cartMessage}
            </p>
          )}

          {bookmarkMessage && (
            <p className="text-green-600 text-center mb-6 bg-green-100 p-4 rounded-lg">
              {bookmarkMessage}
            </p>
          )}

          {loading && (
            <p className="text-gray-600 text-center text-lg">Loading book details...</p>
          )}

          {!loading && !book && !error && (
            <p className="text-gray-600 text-center text-lg bg-gray-200 p-4 rounded-lg">
              No book data available. Please try another book.
            </p>
          )}

          {!loading && book && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 p-6 flex justify-center items-center bg-gray-50">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-80 w-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "/default-cover.jpg";
                  }}
                />
              </div>
              <div className="md:w-2/3 p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{book.title}</h2>
                  <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {renderStars(book.rating)}
                  <p className="text-2xl font-semibold text-indigo-600">
                    ${book.price.toFixed(2)}
                  </p>
                  {book.isExclusiveEdition && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <FaBookmark className="text-yellow-600" />
                      Exclusive Edition
                    </span>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaBook className="text-indigo-600" />
                      <span className="font-semibold">Genre:</span> {book.genre}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <MdFormatAlignLeft className="text-indigo-600" />
                      <span className="font-semibold">Format:</span> {book.format}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaLanguage className="text-indigo-600" />
                      <span className="font-semibold">Language:</span> {book.language}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <IoBusiness className="text-indigo-600" />
                      <span className="font-semibold">Publisher:</span> {book.publisher}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaBarcode className="text-indigo-600" />
                      <span className="font-semibold">ISBN:</span> {book.isbn}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaCalendar className="text-indigo-600" />
                      <span className="font-semibold">Publication Date:</span> {book.publicationDate}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaStore className="text-indigo-600" />
                      <span className="font-semibold">Availability:</span>{" "}
                      {book.isAvailableInStore ? "In Store" : "Not Available"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaBook className="text-indigo-600" />
                      <span className="font-semibold">Stock Quantity:</span> {book.stockQuantity}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded"
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded"
                      disabled={quantity >= book.stockQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-lg font-medium"
                    disabled={isBookmarkLoading}
                  >
                    <IoCartOutline className="text-xl" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleBookmark}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isBookmarked
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } transition-colors ${isBookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    disabled={isBookmarkLoading}
                  >
                    {isBookmarked ? (
                      <FaBookmark className="text-xl" />
                    ) : (
                      <FaRegBookmark className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
};

export default BookDetailPage;