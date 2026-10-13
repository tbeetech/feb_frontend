import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCreditCard, FaHistory, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Payments = () => {
    const { user } = useSelector((state) => state.auth);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddCard, setShowAddCard] = useState(false);

    useEffect(() => {
        fetchPaymentData();
    }, []);

    const fetchPaymentData = async () => {
        try {
            const [methodsResponse, transactionsResponse] = await Promise.all([
                axios.get(
                    `${import.meta.env.VITE_API_URL}/api/payments/methods/${user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ),
                axios.get(
                    `${import.meta.env.VITE_API_URL}/api/payments/transactions/${user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
            ]);

            setPaymentMethods(methodsResponse.data.paymentMethods);
            setTransactions(transactionsResponse.data.transactions);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch payment data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        // Implement payment method addition logic
        setShowAddCard(false);
        fetchPaymentData();
    };

    const handleDeletePaymentMethod = async (methodId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/payments/methods/${methodId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchPaymentData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete payment method');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
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
            {/* Payment Methods Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                    <button
                        onClick={() => setShowAddCard(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                    >
                        <FaPlus className="mr-2" />
                        Add Payment Method
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paymentMethods.map((method) => (
                        <div
                            key={method._id}
                            className="bg-white shadow rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FaCreditCard className="w-6 h-6 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {method.cardType} ending in {method.last4}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Expires {method.expMonth}/{method.expYear}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeletePaymentMethod(method._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction History</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <li key={transaction._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaHistory className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${
                                                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {transaction.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Add Payment Method Modal */}
            {showAddCard && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Payment Method</h3>
                        <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                            {/* Add your payment form fields here */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCard(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold hover:bg-gold-dark"
                                >
                                    Add Card
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Payments; 