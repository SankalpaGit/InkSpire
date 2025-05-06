import React, { useState } from 'react';
import StaffLayout from '../layout/StaffLayout';

const StaffHome = () => {
  const [orderCode, setOrderCode] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [orderItems, setOrderItems] = useState([
    { title: 'The Great Gatsby', quantity: 1, completed: false },
    { title: '1984', quantity: 2, completed: false },
    { title: 'To Kill a Mockingbird', quantity: 1, completed: false },
  ]);

  const handleSearch = () => {
    setShowResults(true);
  };

  const markAsComplete = (index) => {
    const updated = [...orderItems];
    updated[index].completed = true;
    setOrderItems(updated);
  };

  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="border border-gray-300 rounded-lg p-8 bg-white">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4">📦 Order Lookup</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Enter order code"
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

          {showResults && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📚 Order Items</h3>
              <table className="w-full border border-indigo-200 text-left text-base">
                <thead className="bg-indigo-100 text-indigo-700 uppercase text-sm tracking-wide">
                  <tr>
                    <th className="px-4 py-3 border border-indigo-200">#</th>
                    <th className="px-4 py-3 border border-indigo-200">Book Title</th>
                    <th className="px-4 py-3 border border-indigo-200">Quantity</th>
                    <th className="px-4 py-3 border border-indigo-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border border-indigo-100">{index + 1}</td>
                      <td className="px-4 py-3 border border-indigo-100">{item.title}</td>
                      <td className="px-4 py-3 border border-indigo-100">
                        {item.quantity} pc{item.quantity > 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 border border-indigo-100">
                        {item.completed ? (
                          <span className="text-green-600 font-medium">Completed</span>
                        ) : (
                          <button
                            onClick={() => markAsComplete(index)}
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
