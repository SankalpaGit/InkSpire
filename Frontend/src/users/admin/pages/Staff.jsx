import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import gsap from 'gsap';

const Staff = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [staffList, setStaffList] = useState([
        { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' },
        { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
        { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@gmail.com' },
        { firstName: 'David', lastName: 'Williams', email: 'will@gmail.com' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) return;

        setStaffList((prev) => [...prev, formData]);
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
        setShowModal(false);
    };

    const handleDelete = (index) => {
        setStaffList((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(
                modalRef.current,
                { scale: 0.85, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }
    }, [showModal]);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Staff Members</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center transition"
                    >
                        <FaPlus className="mr-2" /> Add Staff
                    </button>
                </div>

                <div className="overflow-x-auto border border-indigo-200 rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50 ">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avatar</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-100">
                            {staffList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-gray-500 italic text-center">
                                        No staff members yet.
                                    </td>
                                </tr>
                            ) : (
                                staffList.map((staff, i) => (
                                    <tr key={i} className="transition bg-white">
                                        <td className="px-6 py-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-bold">
                                                {staff.firstName[0]}
                                                {staff.lastName[0]}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">{staff.firstName}</td>
                                        <td className="px-6 py-4 text-gray-800">{staff.lastName}</td>
                                        <td className="px-6 py-4 text-gray-700">{staff.email}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(i)}
                                                className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                            >
                                                <FaTrash className="mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex justify-center items-center">
                    <div ref={modalRef} className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Add Staff Member</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                                >
                                    Add Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Staff;
