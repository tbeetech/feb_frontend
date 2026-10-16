import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaTruck, FaCheckCircle, FaTimesCircle, FaBox } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/user/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setOrders(response.data.orders);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <FaShoppingBag className="w-5 h-5" />;
            case 'processing':
                return <FaBox className="w-5 h-5" />;
            case 'shipped':
                return <FaTruck className="w-5 h-5" />;
            case 'delivered':
                return <FaCheckCircle className="w-5 h-5" />;
            case 'cancelled':
                return <FaTimesCircle className="w-5 h-5" />;
            default:
                return <FaShoppingBag className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                <Link 
                    to="/shop" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-gold-dark"
                >
                    Continue Shopping
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to create your first order.</p>
                    <div className="mt-6">
                        <Link
                            to="/shop"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white shadow rounded-lg overflow-hidden"
                        >
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item._id} className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="h-16 w-16 object-cover rounded"
                                                    />
                                                    <div>
                                                        <Link 
                                                            to={`/product/${item.product._id}`}
                                                            className="text-sm font-medium text-gray-900 hover:text-gold"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ₦{item.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Total Amount:
                                    </div>
                                    <div className="text-lg font-medium text-gray-900">
                                        ₦{order.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Orders;