import React, { useState } from 'react';
import { FaThumbsUp, FaShareAlt, FaUserCircle } from 'react-icons/fa';
import StarRating from './StarRating';
import api from '../services/api';

const ReviewCard = ({ review }) => {
  const [likes, setLikes] = useState(review.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleLike = async () => {
    if (isLiked) return;
    try {
      await api.put(`/reviews/${review._id}/like`);
      setLikes(likes + 1);
      setIsLiked(true);
    } catch (err) {
      console.error('Error liking review', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Format date to DD-MM-YYYY, HH:mm
  const d = new Date(review.createdAt);
  const date = isNaN(d.getTime()) 
    ? 'Unknown Date' 
    : `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="py-6 border-b border-gray-100 last:border-0 bg-white">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.avatarUrl ? (
            <img src={review.avatarUrl} alt={review.reviewerName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-start mb-1">
            <div>
              <h4 className="text-[15px] font-bold text-gray-800">{review.reviewerName}</h4>
              <span className="text-[12px] text-gray-400 mt-0.5 block">{date}</span>
            </div>
            <div className="flex text-yellow-400 text-sm">
              <StarRating rating={review.rating} />
            </div>
          </div>

          {/* Body */}
          {review.subject && <h5 className="text-[14px] font-semibold text-gray-800 mt-2 mb-1">{review.subject}</h5>}
          <p className="text-[13px] text-gray-500 leading-relaxed mt-2">
            {review.reviewText}
          </p>

          {/* Footer actions - kept for functionality */}
          <div className="flex gap-6 mt-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[12px] transition-colors ${
                isLiked ? 'text-purple-600 font-semibold' : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              <FaThumbsUp /> {likes > 0 ? `${likes} Helpful` : 'Helpful'}
            </button>
            
            <div className="relative">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-purple-600 transition-colors"
              >
                <FaShareAlt /> Share
              </button>
              {showCopied && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
