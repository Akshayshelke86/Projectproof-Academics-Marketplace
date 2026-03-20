import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdTrendingUp, MdPeople, MdAttachMoney, MdShoppingCart } from 'react-icons/md';

const AdminAnalyticsPage = () => {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        totalOrders: 0,
        totalRevenue: 0,
        publishedProjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo || (!userInfo.isAdmin && userInfo.role !== 'admin')) {
            navigate('/dashboard');
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Using existing endpoints to gather data
                const [{ data: users }, { data: projects }] = await Promise.all([
                    axios.get('/api/users', config),
                    axios.get('/api/projects', config)
                ]);

                // We don't have an admin get all orders endpoint yet, so we'll calculate based on projects for now
                // In a real app, you'd add an admin endpoint for orders.

                const published = projects.filter(p => p.status === 'published').length;

                setStats({
                    totalUsers: users.length,
                    totalProjects: projects.length,
                    publishedProjects: published,
                    // Mock data or calculated data
                    totalOrders: 0,
                    totalRevenue: 0
                });

            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [userInfo, navigate]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-black text-[var(--text-main)] mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
                    <MdPeople size={40} className="mb-4 opacity-80" />
                    <p className="text-blue-100 font-medium">Total Users</p>
                    <h2 className="text-4xl font-black">{stats.totalUsers}</h2>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
                    <MdShoppingCart size={40} className="mb-4 opacity-80" />
                    <p className="text-purple-100 font-medium">Total Projects</p>
                    <h2 className="text-4xl font-black">{stats.totalProjects}</h2>
                    <p className="text-xs mt-2 opacity-80">{stats.publishedProjects} Published</p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
                    <MdAttachMoney size={40} className="mb-4 text-green-500" />
                    <p className="text-[var(--text-dim)] font-bold">Platform Revenue</p>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">Coming Soon</h2>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
                    <MdTrendingUp size={40} className="mb-4 text-orange-500" />
                    <p className="text-[var(--text-dim)] font-bold">Total Orders</p>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">Coming Soon</h2>
                </div>
            </div>

            <div className="mt-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h3 className="font-bold text-blue-800 mb-2">Note to Admin</h3>
                <p className="text-sm text-blue-700">Detailed analytics charts (Orders, Revenue) will require new backend APIs to fetch aggregated order data across all users.</p>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
