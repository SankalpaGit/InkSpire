import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBook,
    FaBoxes,
    FaCogs,
    FaUsers,
    FaBullhorn,
    FaTags,
    FaChevronDown,
    FaChevronUp,
    FaSignOutAlt,
    FaClipboardList,
} from 'react-icons/fa';


const AdminSidebar = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSettings = () => {
        setSettingsOpen((prev) => !prev);
    };

    const handleLogout = () => {
        // Example: remove auth token, then redirect
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed left-0 top-0 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav className="flex flex-col gap-3">

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                            }`
                        }
                    >
                        <FaTachometerAlt /> Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/add-book"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                            }`
                        }
                    >
                        <FaBook /> Add Book
                    </NavLink>

                    <NavLink
                        to="/admin/inventory"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                            }`
                        }
                    >
                        <FaBoxes /> Inventory
                    </NavLink>

                    {/* Settings Dropdown */}
                    <button
                        onClick={toggleSettings}
                        className="flex items-center justify-between px-4 py-2 rounded hover:bg-gray-700 transition w-full text-left"
                    >
                        <span className="flex items-center gap-2">
                            <FaCogs /> Settings
                        </span>
                        {settingsOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {settingsOpen && (
                        <div className="ml-6 flex flex-col gap-2 text-sm">
                            <NavLink
                                to="/admin/settings/announcements"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                                    }`
                                }
                            >
                                <FaBullhorn /> Announcements
                            </NavLink>
                            <NavLink
                                to="/admin/settings/sales"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                                    }`
                                }
                            >
                                <FaTags /> Sales
                            </NavLink>
                        </div>
                    )}

                    <NavLink
                        to="/admin/staff"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                            }`
                        }
                    >
                        <FaUsers /> Staff
                    </NavLink>

                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold' : ''
                            }`
                        }
                    >
                        <FaClipboardList /> Orders
                    </NavLink>
                </nav>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 mt-6 rounded hover:bg-red-600 transition bg-red-500 text-white"
            >
                <FaSignOutAlt /> Logout
            </button>
        </div>
    );
};

export default AdminSidebar;
