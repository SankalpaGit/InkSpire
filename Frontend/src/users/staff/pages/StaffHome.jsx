import React, { useState } from 'react';
import axios from 'axios';
import StaffLayout from '../layout/StaffLayout';

const StaffHome = () => {
  const [orderCode, setOrderCode] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5106/api/Order/${orderCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrderDetails(response.data.order);
      setError('');
    } catch (err) {
      setOrderDetails(null);
      setError(err.response?.data?.message || 'Failed to fetch order.');
    }
  };

  const markAsComplete = async (orderItemId) => {
    try {
      await axios.put(
        `http://localhost:5106/api/Order/complete-item/${orderItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Update status locally after marking as complete
      const updatedItems = orderDetails.items.map((item) =>
        item.orderItemId === orderItemId ? { ...item, orderStatus: 'Complete' } : item
      );
      setOrderDetails({ ...orderDetails, items: updatedItems });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark item as complete.');
    }
  };

  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="border border-gray-300 rounded-lg p-8 bg-white">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4">📦 Order Lookup</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Enter order ID"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-base font-medium"
            >
              Search
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {orderDetails && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📚 Order Items</h3>
              <div className="mb-4">
                <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                <p><strong>Member ID:</strong> {orderDetails.memberId}</p>
                <p><strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleString()}</p>
                <p><strong>Total Price:</strong> Rs. {orderDetails.totalPrice}</p>
                <p><strong>Order Status:</strong> {orderDetails.orderStatus}</p>
              </div>
              <table className="w-full border border-indigo-200 text-left text-base">
                <thead className="bg-indigo-100 text-indigo-700 uppercase text-sm tracking-wide">
                  <tr>
                    <th className="px-4 py-3 border border-indigo-200">#</th>
                    <th className="px-4 py-3 border border-indigo-200">Book Title</th>
                    <th className="px-4 py-3 border border-indigo-200">Quantity</th>
                    <th className="px-4 py-3 border border-indigo-200">Price</th>
                    <th className="px-4 py-3 border border-indigo-200">Status</th>
                    <th className="px-4 py-3 border border-indigo-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={item.orderItemId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border border-indigo-100">{index + 1}</td>
                      <td className="px-4 py-3 border border-indigo-100">{item.bookTitle}</td>
                      <td className="px-4 py-3 border border-indigo-100">{item.quantity}</td>
                      <td className="px-4 py-3 border border-indigo-100">Rs. {item.price}</td>
                      <td className="px-4 py-3 border border-indigo-100">
                        <span
                          className={`px-2 py-1 text-sm rounded-full font-medium ${
                            item.orderStatus === 'Complete'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 border border-indigo-100">
                        {item.orderStatus === 'Complete' ? (
                          <span className="text-green-600 font-medium">Completed</span>
                        ) : (
                          <button
                            onClick={() => markAsComplete(item.orderItemId)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Mark as Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffHome;
