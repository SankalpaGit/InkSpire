import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt, FaTrashAlt, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import MemberLayout from "../layout/MemberLayout";
import axios from "axios";

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
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view bookmarks.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5106/api/Bookmark/view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response (Bookmarks):", response.data);

      const bookmarkData = Array.isArray(response.data.bookmarks) ? response.data.bookmarks : [];
      // Fetch full book details for each bookmark
      const formattedBookmarks = await Promise.all(
        bookmarkData.map(async (b) => {
          try {
            const bookResponse = await axios.get(
              `http://localhost:5106/api/ViewBook/${b.bookId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const bookData = bookResponse.data;
            console.log(`Book Details for ${b.bookId}:`, bookData); 
            return {
              id: b.bookmarkId || "unknown-" + Math.random(),
              bookId: b.bookId || "",
              title: b.bookTitle || bookData.title || "Unknown Title",
              author: b.bookAuthor || bookData.author || "Unknown Author",
              coverImage:
                (b.bookImage && typeof b.bookImage === "string"
                  ? `http://localhost:5106/${b.bookImage.replace(/\\/g, "/")}`
                  : bookData.coverImage && typeof bookData.coverImage === "string"
                  ? `http://localhost:5106/${bookData.coverImage.replace(/\\/g, "/")}`
                  : "/default-cover.jpg"),
              price: bookData.price || 0, // Use book details price
              rating: bookData.rating || 0,
              format:
                bookData.format === "Softcopy"
                  ? "Paperback"
                  : bookData.format || "Unknown",
              published: bookData.publicationDate
                ? bookData.publicationDate.split("T")[0]
                : b.createdAt
                ? b.createdAt.split("T")[0]
                : "2000-01-01",
              isBookmarked: true,
            };
          } catch (error) {
            console.error(`Error fetching book ${b.bookId}:`, error.message);
            return {
              id: b.bookmarkId || "unknown-" + Math.random(),
              bookId: b.bookId || "",
              title: b.bookTitle || "Unknown Title",
              author: b.bookAuthor || "Unknown Author",
              coverImage:
                b.bookImage && typeof b.bookImage === "string"
                  ? `http://localhost:5106/${b.bookImage.replace(/\\/g, "/")}`
                  : "/default-cover.jpg",
              price: 0, // Fallback if book fetch fails
              rating: 0,
              format: "Unknown",
              published: b.createdAt ? b.createdAt.split("T")[0] : "2000-01-01",
              isBookmarked: true,
            };
          }
        })
      );
      console.log("Formatted Bookmarks:", formattedBookmarks);
      setBookmarks(formattedBookmarks);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data, error.message);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 404) {
        setBookmarks([]); 
      } else {
        setError(
          error.response?.data?.Message ||
            `Failed to fetch bookmarks: ${error.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (bookId, isBookmarked) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to manage bookmarks.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      if (isBookmarked) {
        const response = await axios.delete(
          `http://localhost:5106/api/Bookmark/remove?bookId=${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess(response.data.Message || "Bookmark removed successfully.");
        setBookmarks((prev) =>
          prev.map((book) =>
            book.bookId === bookId ? { ...book, isBookmarked: false } : book
          )
        );
      } else {
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
        setSuccess(response.data.Message || "Book bookmarked successfully.");
        setBookmarks((prev) =>
          prev.map((book) =>
            book.bookId === bookId ? { ...book, isBookmarked: true } : book
          )
        );
      }
      fetchBookmarks(); 
    } catch (error) {
      console.error("Toggle Error:", error.response?.data, error.message);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 400) {
        setError(error.response.data.Message || "Invalid request.");
      } else if (error.response?.status === 404) {
        setError(error.response.data.Message || "Bookmark not found.");
      } else {
        setError(
          error.response?.data?.Message ||
            `Failed to toggle bookmark: ${error.message}`
        );
      }
    }
    setTimeout(() => setError(""), 3000);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = async (bookId) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to remove bookmarks.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5106/api/Bookmark/remove?bookId=${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.Message || "Bookmark removed successfully.");
      fetchBookmarks();
    } catch (error) {
      console.error("Delete Error:", error.response?.data, error.message);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.response?.status === 404) {
        setError(error.response.data.Message || "Bookmark not found.");
      } else {
        setError(
          error.response?.data?.Message ||
            `Failed to remove bookmark: ${error.message}`
        );
      }
    }
    setTimeout(() => setError(""), 3000);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddToCart = async (book) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to add items to cart.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5106/api/Cart/add",
        { bookId: book.bookId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data.message || `Added ${book.title} to cart!`);
    } catch (error) {
      console.error("Cart Error:", error.response?.data, error.message);
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
    setTimeout(() => setError(""), 3000);
    setTimeout(() => setSuccess(""), 3000);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <MemberLayout>
      <div className="min-h-screen bg-white p-6">
        <h2 className="text-2xl font-bold text-[#112742] mb-6">Your Bookmarks</h2>

        {error && (
          <p className="text-red-600 text-center mb-6 bg-red-100 p-4 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-6 bg-green-100 p-4 rounded-lg">
            {success}
          </p>
        )}
        {loading && (
          <p className="text-gray-600 text-center text-lg">Loading bookmarks...</p>
        )}

        {bookmarks.length === 0 && !loading && !error ? (
          <p className="text-gray-600 text-center mt-20 text-lg">
            You have no bookmarked books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all h-fit relative"
              >
                <div
                  className="h-52 mb-4 rounded"
                  style={{
                    backgroundImage: `url(${book.coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onError={(e) => {
                    e.target.style.backgroundImage = "url(/default-cover.jpg)";
                  }}
                />
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {book.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleBookmark(book.bookId, book.isBookmarked)}
                      className={`p-2 rounded ${
                        book.isBookmarked
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      } transition-colors`}
                      title={book.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                      {book.isBookmarked ? (
                        <FaBookmark className="text-base" />
                      ) : (
                        <FaRegBookmark className="text-base" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(book.bookId)}
                      className="p-2 text-red-500 hover:text-red-700 transition"
                      title="Delete Bookmark"
                    >
                      <FaTrashAlt className="text-base" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{book.author}</p>
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
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default Bookmarks;