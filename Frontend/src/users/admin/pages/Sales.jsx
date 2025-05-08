import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';
import gsap from 'gsap';
import { FaPlus, FaTimes, FaTrash, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState({ start: '', end: '', discount: '' });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);  // For confirmation modal
  const [message, setMessage] = useState({ type: '', text: '' });  // Success or error messages
  const modalRef = useRef();

  // Fetch sales from API
  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5106/api/sale/active');
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  // Handle input changes for new sale form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new sale form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const startUTC = new Date(newSale.start).toISOString();
    const endUTC = new Date(newSale.end).toISOString();

    const payload = {
      startDate: startUTC,
      endDate: endUTC,
      discountPercentage: parseFloat(newSale.discount),
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5106/api/sale/add', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await fetchSales();
      setShowModal(false);
      setNewSale({ start: '', end: '', discount: '' });
      setMessage({ type: 'success', text: 'Sale added successfully!' });
    } catch (err) {
      console.error('Error adding sale:', err.response?.data || err.message);
      setMessage({ type: 'error', text: err.response?.data?.Message || 'Error adding sale.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle remove expired sales action
  const handleRemoveExpired = async () => {
    setConfirmDelete(false);  // Close the confirmation modal

    try {
      setDeleting(true);
      const res = await axios.delete('http://localhost:5106/api/sale/remove-expired', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage({ type: 'success', text: res.data.Message || 'Expired sales removed.' });
      await fetchSales();
    } catch (err) {
      console.error('Error deleting expired sales:', err.response?.data || err.message);
      setMessage({ type: 'error', text: err.response?.data?.Message || 'Error deleting expired sales.' });
    } finally {
      setDeleting(false);
    }
  };

  // Format dates in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Show message (success or error)
  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [showModal]);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(true)}  // Show confirmation modal
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              disabled={deleting}
            >
              <FaTrash className="mr-2" />
              {deleting ? 'Removing...' : 'Remove Expired'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" /> New Sale
            </button>
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`text-${message.type === 'success' ? 'green' : 'red'}-600 mb-4`}>
            {message.text}
          </div>
        )}

        <div className="mb-8">
          <div className="grid gap-4">
            {sales.map((s, i) => (
              <div
                key={s.saleId || i}
                className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded p-4 shadow-sm"
              >
                <div className="flex items-center">
                  <FaClock className="mr-2 text-green-600 text-2xl" />
                  <p className="text-gray-700">
                    <strong>Start:</strong> {formatDate(s.startDate)} &nbsp;|&nbsp;
                    <strong>End:</strong> {formatDate(s.endDate)} &nbsp;|&nbsp;
                    <strong>Discount:</strong> {s.discountPercentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal to Create Sale */}
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
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {confirmDelete && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              <FaExclamationTriangle className="inline mr-2 text-yellow-600" />
              Confirm Deletion
            </h4>
            <p className="text-gray-700 mb-4">Are you sure you want to remove all expired sales?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}  // Close confirmation modal
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button onClick={handleRemoveExpired} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded" >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Sales;
