import React, { useEffect, useState } from 'react';
import { FaUsers, FaBook, FaShoppingCart, FaBoxes } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';

const Dashboard = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [salesChartData, setSalesChartData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("No token found. Redirect to login.");
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch stats
        axios.get('http://localhost:5106/api/Stats/dashboard', { headers })
            .then((res) => {
                setDashboardStats(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch dashboard stats:", err);
            });

        // Fetch chart data
        axios.get('http://localhost:5106/api/Stats/sales/day', { headers })
            .then((res) => {
                const transformed = res.data.data.map(item => {
                    const date = new Date(item.date);
                    const label = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    });
                    return {
                        date: label,
                        sales: item.totalSales,
                    };
                });
                setSalesChartData(transformed);
            })
            .catch((err) => {
                console.error("Failed to fetch sales chart data:", err);
            });
    }, []);

    const stats = [
        { label: 'Staff', value: dashboardStats?.totalStaff ?? 0, icon: <FaUsers />, color: 'bg-blue-600' },
        { label: 'Total Books', value: dashboardStats?.totalBooks ?? 0, icon: <FaBook />, color: 'bg-indigo-600' },
        { label: 'Total Sales ($)', value: dashboardStats?.totalSalesAmount?.toFixed(2) ?? '0.00', icon: <FaShoppingCart />, color: 'bg-green-600' },
        { label: 'Stock Left', value: dashboardStats?.totalAvailableQuantity ?? 0, icon: <FaBoxes />, color: 'bg-yellow-500' },
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

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sales Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-8/12">
                        <h2 className="text-xl font-semibold text-[#112742] mb-4">Daily Sales</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#6366F1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full lg:w-4/12">
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
