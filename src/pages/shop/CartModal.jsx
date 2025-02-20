import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, decrementQuantity, removeFromCart } from "../../redux/features/cart/cartSlice";

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
        dispatch(removeFromCart(product));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
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
                        <div className="flex justify-between items-center pt-4">
                            <span className="font-semibold">Total:</span>
                            <span className="text-primary font-bold">
                                ₦{products.reduce((total, item) => total + item.price * item.quantity, 0)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;