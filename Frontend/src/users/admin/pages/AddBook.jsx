import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 0,
    genre: "",
    format: "",
    isbn: "",
    language: "",
    stock: 0,
    publishDate: "",
    publisher: "",
    description: "",
    markAsNew: false,
    markAsBestseller: false,
    onSale: false,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.author ||
      !formData.genre ||
      !formData.format ||
      !formData.language ||
      formData.price <= 0 ||
      formData.stock < 0 ||
      !formData.image
    ) {
      alert(
        "Please fill all required fields and ensure price > 0 and stock >= 0."
      );
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token
    if (!token) {
      alert("Please log in as an admin to add a book.");
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    const form = new FormData();
    form.append("Title", formData.title);
    form.append("Author", formData.author);
    form.append("Price", formData.price.toString());
    form.append("Genre", formData.genre);
    form.append("Format", formData.format);
    form.append("ISBN", formData.isbn);
    form.append("Language", formData.language);
    form.append("StockQuantity", formData.stock.toString());
    if (formData.publishDate) {
      const utcDate = new Date(formData.publishDate);
      form.append("PublicationDate", utcDate.toISOString());
    } else {
      form.append("PublicationDate", "");
    }
    form.append("Publisher", formData.publisher);
    form.append("Description", formData.description);
    form.append("IsExclusiveEdition", formData.markAsNew.toString());
    form.append("IsAvailableInStore", formData.markAsBestseller.toString());
    form.append("CoverImage", formData.image);

    try {
      const response = await fetch("http://localhost:5106/api/Book/add", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Error adding book:",
          errorText,
          "Status:",
          response.status
        );
        alert(`Failed to add book: ${errorText || "Unauthorized"}`);
        return;
      }

      const data = await response.json();
      console.log("Book added successfully:", data);
      alert("Book added successfully!");
      setFormData({
        title: "",
        author: "",
        price: 0,
        genre: "",
        format: "",
        isbn: "",
        language: "",
        stock: 0,
        publishDate: "",
        publisher: "",
        description: "",
        markAsNew: false,
        markAsBestseller: false,
        onSale: false,
        image: null,
      });
    } catch (error) {
      console.error("Network or server error:", error);
      alert(
        "Failed to add book due to a network or server error: " + error.message
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl text-gray-800 p-2">
        <p className="text-gray-600 mb-6">
          Fill in the book details below to add it to your catalog.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price ($)"
            value={formData.price}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
            min="0.01"
            step="0.01"
          />
          <input
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700"
            required
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
            value={formData.isbn}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
          <input
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            required
            min="0"
          />
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
            max={new Date().toISOString().split("T")[0]}
          />
          <input
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Cover Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
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
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-6 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="markAsNew"
                checked={formData.markAsNew}
                onChange={handleChange}
                className="accent-indigo-500"
              />
              Exclusive Edition
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="markAsBestseller"
                checked={formData.markAsBestseller}
                onChange={handleChange}
                className="accent-indigo-500"
              />
              Available in Store
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end mt-4 gap-3">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddBook;