import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RatingStars from '../../../components/RatingStars';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewsApi';
import { toast } from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa';
import { checkAuth } from '../../../redux/features/auth/authSlice';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [postReview, { isLoading: isSubmitting, error: reviewError }] = usePostReviewMutation();
    const navigate = useNavigate();

    // Check authentication on component mount
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Check if token exists
    const hasToken = !!localStorage.getItem('token');

    useEffect(() => {
        // If there's a token error, alert the user
        if (reviewError) {
            if (reviewError.status === 401) {
                toast.error('Your session has expired. Please login again.');
                navigate('/login');
            } else if (reviewError.data?.message) {
                toast.error(reviewError.data.message);
            } else {
                toast.error('Error submitting review. Please try again.');
            }
        }
    }, [reviewError, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to submit a review');
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!rating) {
            toast.error('Please select a rating');
            return;
        }

        if (comment.trim().length < 10) {
            toast.error('Please enter at least 10 characters in your review');
            return;
        }

        if (comment.trim().length > 500) {
            toast.error('Review cannot exceed 500 characters');
            return;
        }

        try {
            const response = await postReview({
                rating,
                comment: comment.trim(),
                productId
            }).unwrap();

            if (response.success) {
                setRating(0);
                setComment('');
                
                if (onReviewSubmitted) {
                    onReviewSubmitted(response.reviews);
                }
                
                toast.success('Review submitted successfully!');
            } else {
                toast.error(response.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            
            if (error.status === 401) {
                toast.error('Please login again to submit a review');
                dispatch(checkAuth());
                navigate('/login');
            } else {
                toast.error(error.data?.message || 'Failed to submit review');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            {!isAuthenticated && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                    Please <button onClick={() => navigate('/login')} className="font-medium underline">login</button> to submit a review.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                        <RatingStars 
                            rating={rating} 
                            onChange={setRating}
                            size="large"
                            interactive={true}
                        />
                        {rating > 0 && (
                            <span className="text-sm text-gray-600">
                                ({rating} {rating === 1 ? 'star' : 'stars'})
                            </span>
                        )}
                    </div>
                </div>
                
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                        <span className="text-xs text-gray-500 ml-2">
                            ({comment.length}/500 characters)
                        </span>
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        maxLength="500"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Share your thoughts about this product..."
                    />
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            px-6 py-2 bg-black text-white rounded-md font-medium
                            flex items-center gap-2
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}
                            transition-colors
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="w-4 h-4" />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>
            <p className="text-xs text-gray-500 mt-3 text-center">
                Your review will help other customers make informed decisions about this product.
            </p>
        </div>
    );
};

export default ReviewForm;