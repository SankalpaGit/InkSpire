import React, { useState, useEffect } from 'react';
import { FiMail, FiUser, FiCalendar, FiEdit, FiLock } from 'react-icons/fi';
import MemberLayout from '../layout/MemberLayout';
import axios from 'axios';

const initialOrders = [
    {
        id: 'ORD-001',
        books: ['The Silent Echo', 'Whispers in the Wind'],
        date: '2024-12-01',
        status: 'Collected',
    },
    {
        id: 'ORD-002',
        books: ['Midnight Library'],
        date: '2025-01-15',
        status: 'Pending',
    },
    {
        id: 'ORD-003',
        books: ['Ocean of Dreams'],
        date: '2025-03-20',
        status: 'Cancelled',
    },
];

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState(initialOrders);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        axios.get('http://localhost:5106/api/MemberProfile/details', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            const { firstName, lastName, email, joined } = res.data;
            setUser({
                name: `${firstName} ${lastName}`,
                email,
                joined,
            });
        })
        .catch((err) => {
            console.error('Error fetching profile:', err);
        });
    }, [token]);

    const cancelOrder = (id) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === id && order.status === 'Pending'
                    ? { ...order, status: 'Cancelled' }
                    : order
            )
        );
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Collected':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return '';
        }
    };

    const handlePasswordChange = () => {
        axios.put('http://localhost:5106/api/MemberProfile/change-password', {
            newPassword: newPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            alert('Password changed successfully.');
            setShowPasswordModal(false);
            setNewPassword('');
        })
        .catch((err) => {
            console.error('Failed to change password:', err);
            alert('Failed to change password.');
        });
    };

    return (
        <MemberLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <h2 className="text-3xl font-bold text-[#112742] mb-8">Your Profile</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
                    {/* Profile Info */}
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>

                        {user ? (
                            <div className="space-y-3 text-gray-700 text-sm">
                                <div className="flex items-center gap-2">
                                    <FiUser className="text-indigo-600" />
                                    <span><span className="font-medium">Name:</span> {user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMail className="text-indigo-600" />
                                    <span><span className="font-medium">Email:</span> {user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-indigo-600" />
                                    <span><span className="font-medium">Joined:</span> {new Date(user.joined).toDateString()}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Loading profile...</p>
                        )}

                        <div className="flex flex-col gap-2 pt-4 border-t mt-4">
                            <button className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                                <FiEdit /> Update Profile
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center gap-2 text-indigo-600 hover:underline text-sm"
                            >
                                <FiLock /> Change Password
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Order History</h3>
                        {orders.filter(o => o.status !== 'Cancelled').length === 0 ? (
                            <p className="text-gray-500">No active orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders
                                    .filter(order => order.status !== 'Cancelled')
                                    .map(order => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                                        >
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Order ID: <span className="font-medium text-gray-800">{order.id}</span></span>
                                                <span>{new Date(order.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700 mb-1">
                                                <span className="font-medium">Books:</span> {order.books.join(', ')}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClasses(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                {order.status === 'Pending' && (
                                                    <button
                                                        onClick={() => cancelOrder(order.id)}
                                                        className="text-red-500 text-xs hover:underline"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg w-80 shadow-lg space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-1 text-sm text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="px-4 py-1 text-sm text-white bg-indigo-600 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MemberLayout>
    );
};

export default Profile;
