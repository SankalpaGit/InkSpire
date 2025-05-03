import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import gsap from 'gsap';
import { FaPlus, FaTimes, FaTrash, FaClock } from 'react-icons/fa'; // Include FaTrash and FaClock icons

const Sales = () => {
  const [sales, setSales] = useState([]); // state to manage dynamic sales
  const [showModal, setShowModal] = useState(false); // state to manage modal visibility
  const [newSale, setNewSale] = useState({
    start: '',
    end: '',
    discount: '',
  });

  const modalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSale.start || !newSale.end || !newSale.discount) return;
    setSales((prev) => [...prev, newSale]);
    setNewSale({ start: '', end: '', discount: '' });
    setShowModal(false);
  };

  const handleDeleteSale = (index) => {
    setSales((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [showModal]);

  const SalesList = [
    {
      start: '2025-05-01',
      end: '2025-05-10',
      discount: '20',
    },
    {
      start: '2025-06-01',
      end: '2025-06-05',
      discount: '15',
    },
  ];

  const combinedSales = [...SalesList, ...sales]; // Combine static and dynamic sales

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
          >
            <FaPlus className="mr-2" /> New Sale
          </button>
        </div>

        <div className="mb-8">
          <div className="grid gap-4">
            {combinedSales.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded p-4 shadow-sm"
              >
                <div className="flex items-center">
                  <FaClock className="mr-2 text-green-600 text-2xl" /> {/* Timer Icon */}
                  <p className="text-gray-700">
                    <strong>Start:</strong> {formatDate(s.start)} &nbsp;|&nbsp;
                    <strong>End:</strong> {formatDate(s.end)} &nbsp;|&nbsp;
                    <strong>Discount:</strong> {s.discount}%
                  </p>
                </div>

                {/* Show delete button for all sales */}
                <button
                  onClick={() => handleDeleteSale(i)}
                  className="text-red-500 hover:text-red-700 transition text-lg p-2"
                  title="Delete Sale"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Create Sale
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="start"
                value={newSale.start}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="date"
                name="end"
                value={newSale.end}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="discount"
                value={newSale.discount}
                onChange={handleChange}
                placeholder="Discount %"
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="1"
                max="100"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded flex items-center"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Sales;
