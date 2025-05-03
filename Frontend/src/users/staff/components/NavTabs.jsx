import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const NavTabs = () => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab

  const tabs = [
    { name: 'Home', path: '/staff/home' },
    { name: 'Shop', path: '/staff/order' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <nav className="border-b border-gray-200">
        <ul className="flex space-x-8">
          {tabs.map((tab, index) => (
            <li key={index}>
              <Link
                to={tab.path}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-lg font-medium ${
                  activeTab === index
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavTabs;
