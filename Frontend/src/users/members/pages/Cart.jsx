import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import MemberLayout from "../layout/MemberLayout";
import axios from "axios";

// Simple Modal Component
const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p>{message}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false); // Checkout loading state

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your cart.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5106/api/Cart/view", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.cart || !response.data.cart.items.length) {
        setCartItems([]);
        return;
      }

      const items = response.data.cart.items.map((item) => ({
        id: item.cartItemId,
        title: item.bookTitle,
        quantity: item.quantity,
        price: item.price,
        image: item.bookImage
          ? `http://localhost:5106/${item.bookImage.replace(/\\/g, "/")}`
          : "/default-cover.jpg",
      }));
      setCartItems(items);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId, title) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to remove items from cart.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5106/api/Cart/remove/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(`Removed ${title} from cart!`);
      fetchCart(); // Refetch to sync
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError(`Failed to remove item: ${error.message}`);
      }
    }

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let discountPercent = 0;
  if (totalQuantity >= 10) discountPercent = 10;
  else if (totalQuantity >= 5) discountPercent = 5;

  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    setIsModalOpen(true); // Open the modal
  };

  const confirmCheckout = async () => {
    setIsModalOpen(false); // Close the modal
    setIsProcessingCheckout(true); // Start processing checkout
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to proceed with checkout.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      setIsProcessingCheckout(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5106/api/Order/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Checkout successful!");
      setCartItems([]); // Clear the cart items immediately
      fetchCart(); // Refresh cart to empty it from server
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError(
          error.response?.data?.message ||
          "An error occurred during checkout. Please try again."
        );
      }
    }

    setIsProcessingCheckout(false); // Stop processing checkout
  };

  return (
    <MemberLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-[#112742] mb-8">Shopping Cart</h2>

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
        {loading ? (
          <p className="text-gray-600 text-center">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center mt-20 text-gray-600">
            <FaShoppingCart className="text-9xl text-red-400 mx-auto mb-4" />
            <p className="text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Cart Items ({cartItems.length})
              </h3>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-gray-200 py-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-contain rounded shadow-inner"
                      onError={(e) => {
                        e.target.src = "/default-cover.jpg";
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {item.title}
                      </h4>
                      <div className="flex items-center mt-3 border rounded overflow-hidden w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-gray-700 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full">
                    <p className="font-semibold text-indigo-600 text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm mt-4"
                    >
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md h-fit">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Order Summary
              </h3>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="text-red-600">
                    - ${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <hr className="my-4" />
              <div className="flex justify-between mb-4 font-semibold text-gray-900 text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <p className="text-sm text-green-600 mb-4">
                  🎉 You've unlocked a {discountPercent}% discount for borrowing{" "}
                  {totalQuantity} books!
                </p>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-gray-600 text-sm">
                  Promo Code
                </label>
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

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Checkout
              </button>
            </div>


          </div>
        )}

        {/* Show loader when processing checkout */}
        {isProcessingCheckout && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm">
            <div className="flex flex-col justify-center items-center">
              {/* Loader */}
              <div className="animate-spin rounded-full border-t-4 border-indigo-600 w-16 h-16 mb-4"></div>
              <p className="text-white text-lg">Processing...</p>
            </div>
          </div>
        )}

        {/* Modal for Confirmation */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmCheckout}
          message="Are you sure you want to checkout now?"
        />
      </div>
    </MemberLayout>
  );
};

export default Cart;
