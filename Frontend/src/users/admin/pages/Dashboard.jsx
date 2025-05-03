import React from 'react';
import { FaUsers, FaBook, FaShoppingCart, FaBoxes } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../layout/AdminLayout';

const Dashboard = () => {
    const stats = [
        { label: 'Staff', value: 12, icon: <FaUsers />, color: 'bg-blue-600' },
        { label: 'Total Books', value: 1345, icon: <FaBook />, color: 'bg-indigo-600' },
        { label: 'Orders', value: 238, icon: <FaShoppingCart />, color: 'bg-green-600' },
        { label: 'Stock Left', value: 312, icon: <FaBoxes />, color: 'bg-yellow-500' },
    ];

    const chartData = [
        { month: 'Jan', orders: 50 },
        { month: 'Feb', orders: 75 },
        { month: 'Mar', orders: 100 },
        { month: 'Apr', orders: 60 },
        { month: 'May', orders: 90 },
    ];

    return (
        <AdminLayout>
            <div className="w-full">
                <h1 className="text-3xl font-bold text-[#112742] mb-6">Dashboard</h1>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center justify-center text-center h-40"
                        >
                            <div className={`text-white p-3 rounded-full text-2xl mb-3 ${item.color}`}>
                                {item.icon}
                            </div>
                            <p className="text-gray-500">{item.label}</p>
                            <h2 className="text-2xl font-bold">{item.value}</h2>
                        </div>
                    ))}
                </div>

                <div className='flex flex-col-2 gap-4'>
                    {/* Analytics Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md w-8/12">
                        <h2 className="text-xl font-semibold text-[#112742] mb-4">Monthly Order Analytics</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-row w-4/12">
                        <button
                            onClick={() => window.location.href = '/admin/orders'}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md transition w-full mb-4"
                        >
                            View Orders
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/settings/sales'}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition w-full mb-4"
                        >
                            Manage Sales
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/settings/announcements'}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition w-full mb-4"
                        >
                            Announcements
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
