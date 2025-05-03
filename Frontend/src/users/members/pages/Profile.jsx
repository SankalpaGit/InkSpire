import React, { useState } from 'react';
import { FiMail, FiUser, FiCalendar, FiEdit, FiLock, FiHome } from 'react-icons/fi';
import MemberLayout from '../layout/MemberLayout';

const sampleUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joined: '2023-01-15',
    membership: 'Gold',
    preferredFormat: 'Hardcover',
    address: '123 Library Street, Booktown',
};

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
    const [orders, setOrders] = useState(initialOrders);

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

    return (
        <MemberLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <h2 className="text-3xl font-bold text-[#112742] mb-8">Your Profile</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
                    {/* Profile Info */}
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>

                        <div className="space-y-3 text-gray-700 text-sm">
                            <div className="flex items-center gap-2">
                                <FiUser className="text-indigo-600" />
                                <span><span className="font-medium">Name:</span> {sampleUser.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail className="text-indigo-600" />
                                <span><span className="font-medium">Email:</span> {sampleUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-indigo-600" />
                                <span><span className="font-medium">Joined:</span> {new Date(sampleUser.joined).toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiHome className="text-indigo-600" />
                                <span><span className="font-medium">Address:</span> {sampleUser.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    {sampleUser.membership} Member
                                </span>
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                    Prefers {sampleUser.preferredFormat}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4 border-t mt-4">
                            <button className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                                <FiEdit /> Update Profile
                            </button>
                            <button className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                                <FiMail /> Change Email
                            </button>
                            <button className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
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
        </MemberLayout>
    );
};

export default Profile;
