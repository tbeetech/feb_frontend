import React from 'react';
import { useSelector } from 'react-redux';

const Receipt = ({ orderDetails }) => {
    const { products } = useSelector(state => state.cart);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Order Receipt</h2>
                <p className="text-gray-600">Thank you for your purchase!</p>
            </div>

            <div className="space-y-6">
                {/* Order Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Order ID</p>
                            <p className="font-medium">{orderDetails.orderId}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Products</h3>
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <div className="text-sm text-gray-600">
                                            {product.selectedSize && (
                                                <p>Size: {product.selectedSize}</p>
                                            )}
                                            {product.selectedColor && (
                                                <div className="flex items-center space-x-2">
                                                    <p>Color:</p>
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: product.selectedColor }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${product.price}</p>
                                    <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${orderDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping</span>
                        <span>${orderDetails.shipping}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax</span>
                        <span>${orderDetails.tax}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${orderDetails.total}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600">{orderDetails.shippingAddress}</p>
                </div>
            </div>
        </div>
    );
};

export default Receipt; 