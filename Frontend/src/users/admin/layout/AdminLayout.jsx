import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
