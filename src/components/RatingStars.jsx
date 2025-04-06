import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating = 0, onRatingChange, interactive = false, size = "normal" }) => {
  const handleClick = (newRating) => {
    if (interactive && typeof onRatingChange === 'function') {
      onRatingChange(newRating);
    }
  };

  return (
    <div className={`flex ${size === "small" ? "space-x-1" : "space-x-2"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${
            star <= rating ? 'text-gold' : 'text-gray-300'
          } ${size === "small" ? "w-4 h-4" : "w-5 h-5"} ${
            interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''
          }`}
          onClick={() => interactive && handleClick(star)}
          onMouseEnter={(e) => {
            if (interactive) {
              e.currentTarget.classList.add('animate-pulse');
            }
          }}
          onMouseLeave={(e) => {
            if (interactive) {
              e.currentTarget.classList.remove('animate-pulse');
            }
          }}
        />
      ))}
    </div>
  );
};

export default RatingStars;