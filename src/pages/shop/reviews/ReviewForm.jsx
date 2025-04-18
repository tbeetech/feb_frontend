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
        
        // Refresh auth state
        dispatch(checkAuth());
        
        if (!isAuthenticated || !user) {
            toast.error('Please login to submit a review');
            navigate('/login');
            return;
        }

        if (!hasToken) {
            toast.error('Authentication required. Please login again.');
            navigate('/login');
            return;
        }

        if (!rating) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        if (comment.trim().length < 10) {
            toast.error('Please enter at least 10 characters in your review');
            return;
        }

        try {
            console.log('Submitting review:', {
                rating,
                comment: comment.trim(),
                productId
            });

            const response = await postReview({
                rating,
                comment: comment.trim(),
                productId
            }).unwrap();

            console.log('Review submission response:', response);

            if (response.success) {
                // Clear form
                setRating(0);
                setComment('');
                
                // Update parent component with new reviews
                if (onReviewSubmitted && response.reviews) {
                    onReviewSubmitted(response.reviews);
                }
                
                toast.success('Review submitted successfully!');
            } else {
                console.error('Failed to submit review:', response.message);
                toast.error(response.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            
            if (error.status === 401) {
                toast.error('Your login session has expired. Please login again.');
                navigate('/login');
            } else {
                const errorMessage = error.data?.message || 'Failed to submit review';
                toast.error(errorMessage);
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
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <RatingStars
                        rating={rating}
                        onRatingChange={setRating}
                        interactive={true}
                    />
                    {!rating && (
                        <p className="text-sm text-red-500 mt-1">Please select a rating</p>
                    )}
                </div>
                <div className="mb-5">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="comment"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                        placeholder="Share your thoughts about this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        minLength="10"
                    />
                    {comment.trim().length > 0 && comment.trim().length < 10 && (
                        <p className="text-sm text-red-500 mt-1">
                            Please enter at least 10 characters
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    className={`w-full py-3 px-6 rounded-md text-white font-medium flex items-center justify-center space-x-2 shadow-md ${
                        isSubmitting || !isAuthenticated
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-800'
                    } transition-all duration-200 mt-2`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <FaPaperPlane className="h-5 w-5" />
                            <span>Submit Review</span>
                        </>
                    )}
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                    Your review will help other customers make informed decisions about this product.
                </p>
            </form>
        </div>
    );
};

export default ReviewForm; 