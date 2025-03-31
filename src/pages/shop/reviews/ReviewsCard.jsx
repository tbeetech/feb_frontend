import React from 'react';
import { useSelector } from 'react-redux';
import RatingStars from '../../../components/RatingStars';
import { formatDate } from '../../../utils/formatDate';
import { FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReviewsCard = ({ productReviews, onReviewLike }) => {
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
            <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Customer Reviews</h3>
                <p className="text-gray-600">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
            </div>
            
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start space-x-4">
                            <img 
                                src={review.userId?.profileImage || '/default-avatar.png'} 
                                alt={review.userId?.username}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsCard;