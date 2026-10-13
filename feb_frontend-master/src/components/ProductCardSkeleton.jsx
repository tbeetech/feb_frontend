import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden h-full">
      {/* Image skeleton */}
      <div className="bg-gray-200 aspect-square w-full"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Price skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        {/* Rating skeleton */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
          ))}
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex justify-between items-center gap-2 mt-4">
          <div className="h-9 bg-gray-200 rounded w-2/3"></div>
          <div className="h-9 bg-gray-200 rounded-md w-1/6"></div>
          <div className="h-9 bg-gray-200 rounded-md w-1/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 