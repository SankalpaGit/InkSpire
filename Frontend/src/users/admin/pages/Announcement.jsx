import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    endDate: '',
  });

  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5106/api/announcement/all');
      setAnnouncements(res.data.announcements || []);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newAnnouncement.title || !newAnnouncement.message || !newAnnouncement.endDate) return;

  try {
    const token = localStorage.getItem('token'); // adjust this if you're storing the token elsewhere

    await axios.post(
      'http://localhost:5106/api/announcement/create',
      {
        title: newAnnouncement.title,
        message: newAnnouncement.message,
      expiresAt: new Date(newAnnouncement.endDate).toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // only if cookies are also being used
      }
    );

    fetchAnnouncements(); // refresh list
    setNewAnnouncement({ title: '', message: '', endDate: '' });
    handleCloseModal();
  } catch (error) {
    console.error('Failed to post announcement', error);
  }
};

  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setShowModal(false);
        },
      });
    } else {
      setShowModal(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        }
      );
    }
  }, [showModal]);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            New Announcement
          </button>
        </div>

        <div className="mb-8">
          <div className="grid gap-4">
            {announcements.map((a, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded p-4 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-indigo-800">{a.title}</h4>
                <p className="text-gray-700 mt-1">{a.message}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>Posted: {new Date(a.createdAt).toLocaleString()}</span> &middot;{' '}
                  <span>Ends: {new Date(a.expiresAt).toLocaleDateString()}</span>
                </div>
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
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Create Announcement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={newAnnouncement.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={4}
                required
              />
              <input
                type="date"
                name="endDate"
                value={newAnnouncement.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Announcement;
