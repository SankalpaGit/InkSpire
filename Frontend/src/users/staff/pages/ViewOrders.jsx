import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLayout from '../layout/StaffLayout';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5106/api/Order/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const flatRows = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            flatRows.push({
              orderId: order.orderId,
              totalPrice: order.totalPrice,
              orderDate: order.orderDate,
              orderStatus: order.orderStatus,
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price,
            });
          });
        });

        setOrders(flatRows);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">All Orders</h2>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Book ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm text-gray-800">{row.orderId}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(row.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          row.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : row.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {row.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">Rs. {row.totalPrice}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.bookId}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.quantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">Rs. {row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
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
        )}
      </div>
    </StaffLayout>
  );
};

export default ViewOrders;
