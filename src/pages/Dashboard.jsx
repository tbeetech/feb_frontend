import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUser, FaShoppingBag, FaCreditCard, FaStar, FaHeart, FaBoxOpen, FaUpload } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');

    // Define standard tabs for all users
    const standardTabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser />, path: '/dashboard/profile' },
        { id: 'orders', label: 'Orders', icon: <FaShoppingBag />, path: '/dashboard/orders' },
        { id: 'payments', label: 'Payments', icon: <FaCreditCard />, path: '/dashboard/payments' },
        { id: 'reviews', label: 'My Reviews', icon: <FaStar />, path: '/dashboard/reviews' },
        { id: 'likes', label: 'Liked Reviews', icon: <FaHeart />, path: '/dashboard/likes' }
    ];

    // Define admin-only tabs
    const adminTabs = [
        { id: 'manage-products', label: 'Manage Products', icon: <FaBoxOpen />, path: '/admin/manage-products' },
        { id: 'upload-product', label: 'Upload Product', icon: <FaUpload />, path: '/admin/upload-product' }
    ];

    // Combine tabs based on user role
    const tabs = user?.isAdmin 
        ? [...standardTabs, ...adminTabs] 
        : standardTabs;

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        navigate(tab.path);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back, {user?.username}
                            {user?.isAdmin && <span className="ml-2 text-xs bg-gold text-white px-2 py-1 rounded-full">Admin</span>}
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? 'border-gold text-gold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 