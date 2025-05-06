import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Home', path: '/staff/home' },
    { name: 'Shop', path: '/staff/order' },
  ];

  // Update activeTab based on current location
  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => location.pathname.startsWith(tab.path));
    setActiveTab(currentIndex !== -1 ? currentIndex : 0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <nav className="flex items-center justify-between border-b border-gray-200 pb-2">
        <ul className="flex space-x-8">
          {tabs.map((tab, index) => (
            <li key={index}>
              <Link
                to={tab.path}
                className={`relative px-3 py-2 text-md font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default NavTabs;
