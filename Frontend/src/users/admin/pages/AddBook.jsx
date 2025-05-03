import React, { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: 0,
        genre: '',
        format: '',
        isbn: '',
        languages: '',
        stock: 0,
        publishDate: '',
        publisher: '',
        description: '',
        markAsNew: false,
        markAsBestseller: false,
        onSale: false,
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Book submitted:', formData);
        // API submission logic here
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl  text-gray-800 p-2 ">
                <p className="text-gray-600 mb-6">Fill in the book details below to add it to your catalog.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" required />
                    <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" required />

                    <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" required />
                    <input name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" required />

                    <select name="format" value={formData.format} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700" required>
                        <option value="">Select format</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Paperback">Paperback</option>
                        <option value="eBook">eBook</option>
                        <option value="Audiobook">Audiobook</option>
                    </select>
                    <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" />

                    <input name="language" placeholder="language" value={formData.languages} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" />
                    <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" />

                    <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" />
                    <input name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2" />

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full" />
                        {formData.image && (
                            <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-2 h-32 object-contain border rounded" />
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <textarea name="description" placeholder="Description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2" />
                    </div>

                    {/* Checkboxes */}
                    <div className="md:col-span-2 flex flex-wrap gap-6 text-sm text-gray-700">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="markAsNew" checked={formData.markAsNew} onChange={handleChange} className="accent-indigo-500" />
                            Exclusive Edition
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="markAsBestseller" checked={formData.markAsBestseller} onChange={handleChange} className="accent-indigo-500" />
                            Available in Store
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex justify-end mt-4 gap-3">
                        <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Add Book</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddBook;
