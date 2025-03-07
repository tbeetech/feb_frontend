import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, removeFromCart, clearCart } from "../../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

const CartModal = ({ products, isOpen, onClose }) => {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const handleIncrement = (product) => {
        dispatch(addToCart(product));
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };

    const handleRemove = (product) => {
        dispatch(removeFromCart({ id: product._id }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const total = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                >
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ 
                            x: 0,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                damping: 30,
                                stiffness: 300
                            }
                        }}
                        exit={{ x: '100%', opacity: 0 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-md"
                    >
                        <div className="bg-white p-4 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Shopping Cart</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </div>

                            {products.length === 0 ? (
                                <p className="text-center py-4">Your cart is empty</p>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {products.map((product) => (
                                            <div key={product._id} className="flex items-center gap-4 border-b pb-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{product.name}</h3>
                                                    <p className="text-primary">₦{product.price}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleDecrement(product)}
                                                            className="px-2 py-1 bg-gray-200 rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <span>{product.quantity}</span>
                                                        <button
                                                            onClick={() => handleIncrement(product)}
                                                            className="px-2 py-1 bg-gray-200 rounded"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemove(product)}
                                                            className="text-red-500 ml-4"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span className="font-semibold">Total:</span>
                                            <span className="text-primary font-bold">₦{total}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <button
                                                onClick={handleClearCart}
                                                className="w-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Clear Cart
                                            </button>
                                            <Link
                                                to="/checkout"
                                                state={{ total }}
                                                className="w-1/2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-center"
                                                onClick={onClose}
                                            >
                                                Proceed to Checkout
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartModal;