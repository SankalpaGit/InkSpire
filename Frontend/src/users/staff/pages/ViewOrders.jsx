import React, { useState } from 'react';
import StaffLayout from '../layout/StaffLayout';

const ViewOrders = () => {
  const orders = [
    { bookName: 'The Great Gatsby', orderDate: '2025-04-25', status: 'Delivered', quantity: 2 },
,
    { bookName: 'The Catcher in the Rye', orderDate: '2025-05-01', status: 'Delivered', quantity: 3 },
    { bookName: 'The Alchemist', orderDate: '2025-05-01', status: 'Shipped', quantity: 3 },
    { bookName: 'The Hobbit', orderDate: '2025-05-01', status: 'Shipped', quantity: 3 },
    { bookName: 'The Lord of the Rings', orderDate: '2025-05-01', status: 'Shipped', quantity: 3 },
    { bookName: 'Pride and Prejudice', orderDate: '2025-05-01', status: 'Shipped', quantity: 3 },
    { bookName: 'War and Peace', orderDate: '2025-05-01', status: 'Shipped', quantity: 3 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
   <StaffLayout>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
        <div className="overflow-x-auto border border-indigo-200 rounded-lg shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Book Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">{order.bookName}</td>
                  <td className="px-6 py-4 text-gray-600">{order.orderDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.quantity}</td>
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
      </StaffLayout>
  );
};

export default ViewOrders;
