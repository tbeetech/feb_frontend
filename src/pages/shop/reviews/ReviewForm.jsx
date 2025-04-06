import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RatingStars from '../../../components/RatingStars';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewsApi';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const { user } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [postReview, { isLoading: isSubmitting }] = usePostReviewMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to submit a review');
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
                if (onReviewSubmitted) {
                    console.log('Calling onReviewSubmitted with:', response.reviews);
                    await onReviewSubmitted(response.reviews);
                }
                
                toast.success('Review submitted successfully!');
            } else {
                console.error('Failed to submit review:', response.message);
                toast.error(response.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.data?.message || 'Failed to submit review';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
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
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="comment"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
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
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gold hover:bg-gold-dark'
                    } transition-colors duration-200`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm; 