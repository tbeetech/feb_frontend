import React from 'react';
import { useSelector } from 'react-redux';
import RatingStars from '../../../components/RatingStars';
import { formatDate } from '../../../utils/formatDate';
import { FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ReviewsCard = ({ productReviews, onReviewLike, isLoading }) => {
    const { user } = useSelector((state) => state.auth);
    const reviews = productReviews || [];

    const handleLike = async (reviewId) => {
        if (!user) {
            toast.error('Please login to like a review');
            return;
        }
        if (onReviewLike) {
            onReviewLike(reviewId);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!reviews.length) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first to review this product!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <motion.div 
                        key={review._id} 
                        className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                                {review.userId?.username ? (
                                    <span className="text-lg font-bold uppercase">{review.userId.username.charAt(0)}</span>
                                ) : (
                                    <span className="text-lg font-bold">?</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{review.userId?.username}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                            {review.isEdited && (
                                                <span className="ml-2 text-xs text-gray-400">
                                                    (edited {formatDate(review.editedAt)})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <RatingStars rating={review.rating} />
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                                <div className="mt-3 flex items-center space-x-4">
                                    <button
                                        onClick={() => handleLike(review._id)}
                                        className={`flex items-center space-x-1 text-sm ${
                                            review.likes?.includes(user?._id)
                                                ? 'text-gold'
                                                : 'text-gray-500 hover:text-gold'
                                        }`}
                                    >
                                        <FaThumbsUp />
                                        <span>{review.likes?.length || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsCard;