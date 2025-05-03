import React, { useState } from 'react';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import MemberLayout from '../layout/MemberLayout';

const initialCart = [
    {
        id: 1,
        title: 'The Silent Echo',
        author: 'Sarah Johnson',
        quantity: 1,
        price: 18.99,
    },
    {
        id: 2,
        title: 'The Last Horizon',
        author: 'Emily Parker',
        quantity: 2,
        price: 16.99,
    },
];

const Cart = () => {
    const [cartItems, setCartItems] = useState(initialCart);
    const [promoCode, setPromoCode] = useState('');

    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    let discountPercent = 0;
    if (totalQuantity >= 10) {
        discountPercent = 10;
    } else if (totalQuantity >= 5) {
        discountPercent = 5;
    }
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    return (
        <MemberLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <h2 className="text-3xl font-bold text-[#112742] mb-8">Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <p className="text-gray-600 text-center mt-20 text-lg">Your cart is empty.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Cart Items */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md max-h-[600px] overflow-y-auto">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Cart Items ({cartItems.length})
                            </h3>

                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-start border-b border-gray-200 py-6"
                                >
                                    {/* Left: Image + Info + Quantity */}
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-gray-200 rounded shadow-inner" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">{item.author}</p>
                                            <div className="flex items-center mt-3 border rounded overflow-hidden w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 text-gray-700 font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Price and Remove */}
                                    <div className="flex flex-col items-end justify-between h-full">
                                        <p className="font-semibold text-indigo-600 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm mt-4"
                                        >
                                            <FaTrashAlt /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h3>
                            <div className="flex justify-between mb-2 text-gray-700">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discountPercent > 0 && (
                                <div className="flex justify-between mb-2 text-gray-700">
                                    <span>Discount ({discountPercent}%)</span>
                                    <span className="text-red-600">- ${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr className="my-4" />
                            <div className="flex justify-between mb-4 font-semibold text-gray-900 text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            {discountPercent > 0 && (
                                <p className="text-sm text-green-600 mb-4">
                                    🎉 You've unlocked a {discountPercent}% discount for borrowing {totalQuantity} books!
                                </p>
                            )}

                            <div className="mb-6">
                                <label className="block mb-2 text-gray-600 text-sm">Promo Code</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Enter code"
                                    />
                                    <button className="bg-indigo-600 text-white px-4 rounded-r hover:bg-indigo-700 text-sm">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold text-sm flex items-center justify-center gap-2">
                                <FaShoppingCart /> Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </MemberLayout>
    );
};

export default Cart;
