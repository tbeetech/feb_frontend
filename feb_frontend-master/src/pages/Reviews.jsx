import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaTrash, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import { useGetUserActivityQuery } from '../redux/features/reviews/reviewsApi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Reviews = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, error: apiError, isLoading, refetch } = useGetUserActivityQuery(user?._id);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const reviews = data?.reviews || [];
    const likedReviews = data?.likedReviews || [];

    const filteredReviews = reviews.filter(review => 
        review.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLikedReviews = likedReviews.filter(review =>
        review.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        
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

    const handleLikeReview = async (reviewId, isLiked) => {
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
            toast.success(isLiked ? 'Review unliked' : 'Review liked');
            refetch();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to like/unlike review';
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
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search reviews by product or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {(error || apiError) && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error || apiError?.data?.message || 'An error occurred'}
                </div>
            )}

            {/* Reviews Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Total Reviews</h3>
                    <p className="text-2xl font-bold text-gold">{reviews.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Liked Reviews</h3>
                    <p className="text-2xl font-bold text-gold">{likedReviews.length}</p>
                </div>
            </div>

            {/* My Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Reviews</h2>
                <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-500">
                                {searchTerm ? 'No reviews match your search.' : 'You haven\'t written any reviews yet.'}
                            </p>
                            {!searchTerm && (
                                <Link
                                    to="/shop"
                                    className="inline-block mt-4 px-6 py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors"
                                >
                                    Browse Products
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <Link to={`/product/${review.productId._id}`}>
                                            <img
                                                src={getImageUrl(review.productId.image)}
                                                alt={review.productId.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        </Link>
                                        <div>
                                            <Link
                                                to={`/product/${review.productId._id}`}
                                                className="font-medium text-gray-900 hover:text-gold transition-colors"
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
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete Review"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Liked Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liked Reviews</h2>
                <div className="space-y-4">
                    {filteredLikedReviews.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-500">
                                {searchTerm ? 'No liked reviews match your search.' : 'You haven\'t liked any reviews yet.'}
                            </p>
                            {!searchTerm && (
                                <Link
                                    to="/shop"
                                    className="inline-block mt-4 px-6 py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors"
                                >
                                    Browse Products
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredLikedReviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <Link to={`/product/${review.productId._id}`}>
                                        <img
                                            src={getImageUrl(review.productId.image)}
                                            alt={review.productId.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                to={`/product/${review.productId._id}`}
                                                className="font-medium text-gray-900 hover:text-gold transition-colors"
                                            >
                                                {review.productId.name}
                                            </Link>
                                            <button
                                                onClick={() => handleLikeReview(review._id, true)}
                                                className="text-red-500 hover:text-red-600 transition-colors"
                                                title="Unlike Review"
                                            >
                                                <FaHeart />
                                            </button>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating ? 'text-gold' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-500">
                                                by {review.userId.username} • {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-2">{review.comment}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Reviews;