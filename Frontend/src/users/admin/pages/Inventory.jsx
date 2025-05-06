import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AdminLayout from "../layout/AdminLayout";
import Modal from "./Modal";

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "notification", // 'confirmation'
    message: "",
    onConfirm: null,
  });

  // Fetch books from backend
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setModalState({
        isOpen: true,
        type: "notification",
        message: "Please log in as an admin.",
        onConfirm: null,
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5106/api/ViewBook/all?pageNumber=${currentPage}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setModalState({
            isOpen: true,
            type: "notification",
            message: "Unauthorized. Please log in again.",
            onConfirm: null,
          });
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        throw new Error("Failed to fetch books.");
      }

      const data = await response.json();
      setBooks(data.books);
      setTotalBooks(data.totalBooks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on mount and when currentPage changes
  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  // Handle delete book
  const handleDelete = (bookId) => {
    setModalState({
      isOpen: true,
      type: "confirmation",
      message: "Are you sure you want to delete this book?",
      onConfirm: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setModalState({
            isOpen: true,
            type: "notification",
            message: "Please log in as an admin.",
            onConfirm: null,
          });
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:5106/api/Book/delete/${bookId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              setModalState({
                isOpen: true,
                type: "notification",
                message: "Unauthorized. Please log in again.",
                onConfirm: null,
              });
              setTimeout(() => (window.location.href = "/login"), 2000);
              return;
            }
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete book.");
          }

          setModalState({
            isOpen: true,
            type: "notification",
            message: "Book deleted successfully.",
            onConfirm: null,
          });
          fetchBooks(); // Refresh book list
        } catch (err) {
          setModalState({
            isOpen: true,
            type: "notification",
            message: `Failed to delete book: ${err.message}`,
            onConfirm: null,
          });
        }
      },
    });
  };

  // Handle edit book (open modal)
  const handleEdit = (book) => {
    setEditBook({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      description: book.description || "",
      genre: book.genre,
      price: book.price,
      stockQuantity: book.stockQuantity,
      language: book.language,
      format: book.format,
      publisher: book.publisher || "",
      isbn: book.isbn || "",
      publicationDate: book.publicationDate
        ? book.publicationDate.split("T")[0]
        : "",
      isAvailableInStore: book.isAvailableInStore,
      isExclusiveEdition: book.isExclusiveEdition,
      coverImage: null,
    });
    setShowEditModal(true);
  };

  // Handle modal form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditBook((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setModalState({
        isOpen: true,
        type: "notification",
        message: "Please log in as an admin.",
        onConfirm: null,
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    const form = new FormData();
    if (editBook.title) form.append("Title", editBook.title);
    if (editBook.author) form.append("Author", editBook.author);
    if (editBook.description) form.append("Description", editBook.description);
    if (editBook.genre) form.append("Genre", editBook.genre);
    if (editBook.price > 0) form.append("Price", editBook.price.toString());
    if (editBook.stockQuantity >= 0)
      form.append("StockQuantity", editBook.stockQuantity.toString());
    if (editBook.language) form.append("Language", editBook.language);
    if (editBook.format) form.append("Format", editBook.format);
    if (editBook.publisher) form.append("Publisher", editBook.publisher);
    if (editBook.isbn) form.append("ISBN", editBook.isbn);
    if (editBook.publicationDate) {
      const utcDate = new Date(editBook.publicationDate);
      form.append("PublicationDate", utcDate.toISOString());
    }
    form.append("IsAvailableInStore", editBook.isAvailableInStore.toString());
    form.append("IsExclusiveEdition", editBook.isExclusiveEdition.toString());
    if (editBook.coverImage) form.append("CoverImage", editBook.coverImage);

    try {
      const response = await fetch(
        `http://localhost:5106/api/Book/update/${editBook.bookId}`,
        {
          method: "PUT",
          body: form,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setModalState({
            isOpen: true,
            type: "notification",
            message: "Unauthorized. Please log in again.",
            onConfirm: null,
          });
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update book.");
      }

      setModalState({
        isOpen: true,
        type: "notification",
        message: "Book updated successfully.",
        onConfirm: null,
      });
      setShowEditModal(false);
      setEditBook(null);
      fetchBooks();
    } catch (err) {
      setModalState({
        isOpen: true,
        type: "notification",
        message: `Failed to update book: ${err.message}`,
        onConfirm: null,
      });
    }
  };

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Inventory</h2>
        {loading && <p className="text-gray-600">Loading books...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto border border-indigo-200 rounded-lg shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Book Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Published Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.map((book) => (
                  <tr key={book.bookId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">{book.title}</td>
                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {book.publisher}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {book.publicationDate
                        ? new Date(book.publicationDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {book.stockQuantity}
                    </td>
                    <td className="px-6 py-4 text-center flex">
                      <button
                        onClick={() => handleEdit(book)}
                        className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Edit"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
                        title="Delete"
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalBooks > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === i + 1
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editBook && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Edit Book
              </h3>
              <form
                onSubmit={handleEditSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  name="title"
                  placeholder="Title"
                  value={editBook.title}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="author"
                  placeholder="Author"
                  value={editBook.author}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price ($)"
                  value={editBook.price}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                  min="0.01"
                  step="0.01"
                />
                <input
                  name="genre"
                  placeholder="Genre"
                  value={editBook.genre}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <select
                  name="format"
                  value={editBook.format}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700"
                >
                  <option value="">Select format</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="eBook">eBook</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
                <input
                  name="isbn"
                  placeholder="ISBN"
                  value={editBook.isbn}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="language"
                  placeholder="Language"
                  value={editBook.language}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="stockQuantity"
                  placeholder="Stock"
                  value={editBook.stockQuantity}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                  min="0"
                />
                <input
                  type="date"
                  name="publicationDate"
                  value={editBook.publicationDate}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                  max={new Date().toISOString().split("T")[0]}
                />
                <input
                  name="publisher"
                  placeholder="Publisher"
                  value={editBook.publisher}
                  onChange={handleEditChange}
                  className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Cover Image (optional)
                  </label>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleEditChange}
                    className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  {editBook.coverImage && (
                    <img
                      src={URL.createObjectURL(editBook.coverImage)}
                      alt="Preview"
                      className="mt-2 h-32 object-contain border rounded"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <textarea
                    name="description"
                    placeholder="Description"
                    rows={3}
                    value={editBook.description}
                    onChange={handleEditChange}
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-6 text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isExclusiveEdition"
                      checked={editBook.isExclusiveEdition}
                      onChange={handleEditChange}
                      className="accent-indigo-500"
                    />
                    Exclusive Edition
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isAvailableInStore"
                      checked={editBook.isAvailableInStore}
                      onChange={handleEditChange}
                      className="accent-indigo-500"
                    />
                    Available in Store
                  </label>
                </div>
                <div className="md:col-span-2 flex justify-end mt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditBook(null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reusable Modal for Confirmations and Notifications */}
        <Modal
          isOpen={modalState.isOpen}
          type={modalState.type}
          message={modalState.message}
          onConfirm={() => {
            if (modalState.onConfirm) modalState.onConfirm();
            setModalState({ ...modalState, isOpen: false });
          }}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
        />
      </div>
    </AdminLayout>
  );
};

export default Inventory;
