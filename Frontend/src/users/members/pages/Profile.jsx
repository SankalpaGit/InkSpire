import React, { useState, useEffect } from 'react';
import { FiMail, FiUser, FiCalendar, FiEdit, FiLock } from 'react-icons/fi';
import MemberLayout from '../layout/MemberLayout';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false); // State for the cancel confirmation modal
    const [itemToCancel, setItemToCancel] = useState(null); // State to hold the item info to cancel
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        // Fetch user profile
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

        // Fetch orders
        axios.get('http://localhost:5106/api/Order/my-orders', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (Array.isArray(res.data.orders)) {
                    setOrders(res.data.orders);
                } else {
                    console.warn('Unexpected orders format:', res.data);
                    setOrders([]);
                }
            })
            .catch((err) => {
                const isNoOrders = err.response?.status === 404 && err.response?.data?.message?.includes('No orders');
                if (isNoOrders) {
                    console.info('No orders found for the user.');
                    setOrders([]);
                } else {
                    console.error('Error fetching orders:', err);
                }
            });
    }, [token]);

    const cancelOrderItem = (orderId, itemId) => {
        // Make an API request to cancel the order item
        axios.delete(`http://localhost:5106/api/Order/cancel-item/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                // Assuming the API response is successful
                setOrders(prev =>
                    prev.map(order =>
                        order.orderId === orderId
                            ? {
                                ...order,
                                items: order.items.map(item =>
                                    item.orderItemId === itemId
                                        ? { ...item, status: 'Cancelled' } // Update item status
                                        : item
                                ),
                            }
                            : order
                    )
                );
                setShowCancelModal(false); // Close the modal after successful cancellation
            })
            .catch((err) => {
                console.error('Failed to cancel item:', err);
                setShowCancelModal(false); // Close the modal even on failure
            });
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Collected':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Shipped':
                return 'bg-blue-100 text-blue-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
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

    const isOrderCancelled = (order) => {
        return order.items.every(item => item.status === 'Cancelled');
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
                        {orders.filter(o => o.orderStatus !== 'Cancelled').length === 0 ? (
                            <p className="text-gray-500">No active orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders
                                    .filter(order => order.orderStatus !== 'Cancelled')
                                    .map(order => (
                                        <div
                                            key={order.orderId}
                                            className={`border border-gray-200 rounded-lg p-4 hover:shadow-sm transition ${isOrderCancelled(order) ? 'opacity-50' : ''}`}
                                        >
                                            {/* Conditionally hide order date and total price */}
                                            {!isOrderCancelled(order) && (
                                                <>
                                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                        <span>Order Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm mt-2">
                                                        <span className="font-medium">Total:</span> ₹{order.totalPrice.toFixed(2)}
                                                    </p>
                                                </>
                                            )}

                                            {/* Display each book item in its own row */}
                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div key={item.orderItemId} className="flex justify-between items-center text-sm text-gray-600">
                                                        <span className="font-bold">{item.bookTitle}</span>
                                                        <span className="text-gray-700">Quantity: {item.quantity}</span>
                                                        {/* Display item status */}
                                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClasses(item.status)}`}>
                                                            {item.status}
                                                        </span>

                                                        {/* Cancel button for individual item */}
                                                        {item.status === 'Pending' && (
                                                            <button
                                                                onClick={() => {
                                                                    setItemToCancel({ orderId: order.orderId, itemId: item.orderItemId });
                                                                    setShowCancelModal(true); // Show cancel modal
                                                                }}
                                                                className="text-red-500 text-xs hover:underline ml-2"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
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

            {/* Cancel Confirmation Modal */}
            {showCancelModal && itemToCancel && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-lg w-80 shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to cancel this item?</h3>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="px-4 py-1 text-sm text-gray-600"
                        >
                            No
                        </button>
                        <button
                            onClick={() => cancelOrderItem(itemToCancel.orderId, itemToCancel.itemId)}
                            className="px-4 py-1 text-sm text-white bg-red-600 rounded"
                        >
                            Yes, Cancel
                        </button>
                    </div>
                </div>
            </div>
)}
        </MemberLayout>
    );
};

export default Profile;
