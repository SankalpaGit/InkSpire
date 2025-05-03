import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons
import AdminLayout from '../layout/AdminLayout';

const Inventory = () => {
    const books = [
        {
            name: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            isbn: "9780743273565",
            publisher: "Scribner",
            publishedDate: "April 10, 1925",
            price: "$10.99",
            stock: 12,
        },
        {
            name: "1984",
            author: "George Orwell",
            isbn: "9780451524935",
            publisher: "Secker & Warburg",
            publishedDate: "June 8, 1949",
            price: "$9.99",
            stock: 25,
        },
        {
            name: "To Kill a Mockingbird",
            author: "Harper Lee",
            isbn: "9780061120084",
            publisher: "J.B. Lippincott & Co.",
            publishedDate: "July 11, 1960",
            price: "$8.99",
            stock: 8,
        },
        {
            name: "The Catcher in the Rye",
            author: "J.D. Salinger",
            isbn: "9780316769488",
            publisher: "Little, Brown and Company",
            publishedDate: "July 16, 1951",
            price: "$7.99",
            stock: 15,
        },
        {
            name: "The Alchemist",
            author: "Paulo Coelho",
            isbn: "9780061122415",
            publisher: "HarperOne",
            publishedDate: "April 15, 1993",
            price: "$11.99",
            stock: 20,
        },
        {
            name: "The Alchemist",
            author: "Paulo Coelho",
            isbn: "9780061122415",
            publisher: "HarperOne",
            publishedDate: "April 15, 1993",
            price: "$11.99",
            stock: 20,
        },
        // Add more books as needed
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5;

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(books.length / booksPerPage);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Inventory</h2>
                <div className="overflow-x-auto border border-indigo-200 rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Book Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ISBN</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Publisher</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Published Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentBooks.map((book, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-800">{book.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                                    <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                                    <td className="px-6 py-4 text-gray-600">{book.publisher}</td>
                                    <td className="px-6 py-4 text-gray-600">{book.publishedDate}</td>
                                    <td className="px-6 py-4 text-gray-600">{book.price}</td>
                                    <td className="px-6 py-4 text-gray-700">{book.stock}</td>
                                    <td className="px-6 py-4 text-center flex">
                                        {/* Edit and Delete icons */}
                                        <button
                                            className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            title="Edit"
                                        >
                                            <FaEdit className="text-lg" />
                                        </button>
                                        <button
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

                {/* Pagination Controls */}
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
                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                    : 'border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Inventory;
