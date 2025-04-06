import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import { useGetUserActivityQuery } from '../redux/features/reviews/reviewsApi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Reviews = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, error: apiError, isLoading, refetch } = useGetUserActivityQuery(user?._id);
    const [error, setError] = useState(null);

    const reviews = data?.reviews || [];
    const likedReviews = data?.likedReviews || [];

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
            toast.success('Review deleted successfully');
            refetch();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete review';
            setError(errorMsg);
            toast.error(errorMsg);
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
            toast.success('Review liked successfully');
            refetch();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to like review';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    if (isLoading) {
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
                {(error || apiError) && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {error || apiError?.data?.message || 'An error occurred'}
                    </div>
                )}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">You haven't written any reviews yet.</p>
                    ) : (
                        reviews.map((review) => (
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
                                                className="font-medium hover:text-gold transition-colors"
                                            >
                                                {review.productId.name}
                                            </Link>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? 'text-gold'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete Review"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Liked Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liked Reviews</h2>
                <div className="space-y-4">
                    {likedReviews.length === 0 ? (
                        <p className="text-gray-500 italic">You haven't liked any reviews yet.</p>
                    ) : (
                        likedReviews.map((review) => (
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
                                            <div className="flex items-center">
                                                <Link
                                                    to={`/product/${review.productId._id}`}
                                                    className="font-medium hover:text-gold transition-colors"
                                                >
                                                    {review.productId.name}
                                                </Link>
                                                <span className="mx-2 text-gray-400">•</span>
                                                <span className="text-sm text-gray-600">
                                                    Reviewed by {review.userId.username}
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? 'text-gold'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                            <button
                                                onClick={() => handleLikeReview(review._id)}
                                                className="flex items-center space-x-1 text-gold mt-2"
                                            >
                                                <FaHeart />
                                                <span className="text-sm">Liked</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Reviews; 