import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const Reviews = () => {
    const { user } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/reviews/user/${user._id}/activity`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setReviews(response.data.reviews);
            setLikedReviews(response.data.likedReviews);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchReviews();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleLikeReview = async (reviewId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchReviews();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to like review');
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
            className="space-y-8"
        >
            {/* My Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Reviews</h2>
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white shadow rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link to={`/product/${review.productId._id}`}>
                                        <img
                                            src={getImageUrl(review.productId.image)}
                                            alt={review.productId.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </Link>
                                    <div>
                                        <Link
                                            to={`/product/${review.productId._id}`}
                                            className="text-sm font-medium text-gray-900 hover:text-gold"
                                        >
                                            {review.productId.name}
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating ? 'text-gold' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {review.comment}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingReview(review)}
                                        className="text-gray-400 hover:text-gold"
                                    >
                                        <FaEdit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <FaTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Liked Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liked Reviews</h2>
                <div className="space-y-4">
                    {likedReviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white shadow rounded-lg p-4"
                        >
                            <div className="flex items-start">
                                <div className="flex items-center space-x-4">
                                    <Link to={`/product/${review.productId._id}`}>
                                        <img
                                            src={getImageUrl(review.productId.image)}
                                            alt={review.productId.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </Link>
                                    <div>
                                        <Link
                                            to={`/product/${review.productId._id}`}
                                            className="text-sm font-medium text-gray-900 hover:text-gold"
                                        >
                                            {review.productId.name}
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating ? 'text-gold' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {review.comment}
                                        </p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <p className="text-xs text-gray-500">
                                                By {review.userId.username}
                                            </p>
                                            <span className="text-gray-300">•</span>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleLikeReview(review._id)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                >
                                    <FaHeart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Review Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Review</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Implement review update logic
                            setEditingReview(null);
                            fetchReviews();
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rating
                                </label>
                                <div className="mt-1 flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEditingReview({
                                                ...editingReview,
                                                rating: star
                                            })}
                                            className="focus:outline-none"
                                        >
                                            <FaStar
                                                className={`w-6 h-6 ${
                                                    star <= editingReview.rating ? 'text-gold' : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Comment
                                </label>
                                <textarea
                                    value={editingReview.comment}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview,
                                        comment: e.target.value
                                    })}
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold hover:bg-gold-dark"
                                >
                                    Update Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Reviews; 