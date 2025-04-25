import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import PropTypes from 'prop-types';

const OrderConfirmation = ({ orderNumber, totalAmount, email }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto"
        >
            <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                            <FaCheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        
                        <div className="mt-6 text-center">
                            <h3 className="text-2xl font-bold text-gray-900">Order Successfully Placed!</h3>
                            <div className="mt-2">
                                <p className="text-lg text-gray-600">
                                    Thank you for your order #{orderNumber}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Total Amount: ₦{totalAmount.toLocaleString()}
                                </p>
                            </div>
                            
                            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-left">
                                    <MdEmail className="h-6 w-6 text-gray-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Check your email</p>
                                        <p className="text-sm text-gray-500">
                                            We've sent a confirmation to {email}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-left">
                                    <FaWhatsapp className="h-6 w-6 text-green-500" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Complete your payment</p>
                                        <p className="text-sm text-gray-500">
                                            Contact us on WhatsApp with your payment confirmation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-900">Next steps:</h4>
                                <ol className="mt-2 text-sm text-gray-500 list-decimal list-inside space-y-2">
                                    <li>Download the receipt from your email</li>
                                    <li>Make payment via bank transfer using the account details provided</li>
                                    <li>Send payment confirmation via WhatsApp</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://wa.me/message/NP6XO5SXNXG5G1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                            >
                                <FaWhatsapp className="mr-2" />
                                Primary WhatsApp
                            </a>
                            <a
                                href="https://wa.me/2348088690856"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                            >
                                <FaWhatsapp className="mr-2" />
                                Secondary WhatsApp
                            </a>
                        </div>
                        <Link
                            to="/shop"
                            className="flex w-full items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

OrderConfirmation.propTypes = {
    orderNumber: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired
};

export default OrderConfirmation;