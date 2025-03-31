import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

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
                return 'text-yellow-500';
            case 'processing':
                return 'text-blue-500';
            case 'shipped':
                return 'text-purple-500';
            case 'delivered':
                return 'text-green-500';
            case 'cancelled':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <FaShoppingBag className="w-5 h-5" />;
            case 'processing':
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
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white shadow rounded-lg overflow-hidden"
                        >
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(order.status)}
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Order #{order.orderNumber}
                                        </h3>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
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
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.product.name}
                                                        </p>
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
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Orders; 