import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, interactive = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          } ${star <= rating ? 'text-[#fbbf24]' : 'text-gray-300'}`}
          onClick={() => interactive && setRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
