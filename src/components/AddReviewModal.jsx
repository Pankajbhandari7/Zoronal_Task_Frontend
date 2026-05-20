import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import api from '../services/api';
import StarRating from './StarRating';

const AddReviewModal = ({ isOpen, onClose, companyId, onAdd }) => {
  const [formData, setFormData] = useState({
    reviewerName: '',
    subject: '',
    reviewText: '',
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError('Please provide a rating.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/reviews', { ...formData, companyId });
      onAdd(res.data);
      onClose();
      setFormData({ reviewerName: '', subject: '', reviewText: '', rating: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Decorative Top Left Shapes */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <div className="absolute top-[-30px] left-[30px] w-36 h-36 bg-[#e2d5fa] rounded-full"></div>
          <div className="absolute top-0 left-0 w-28 h-32 bg-gradient-to-b from-[#8f00ff] to-[#2500ff] rounded-br-full"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 pt-8 pb-2 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-800 hover:text-black">
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold text-black mt-2">Add Review</h2>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 relative z-10 mt-2">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" name="reviewerName" value={formData.reviewerName} onChange={handleChange} placeholder="Enter" className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" required />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter" className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" required />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Enter your Review</label>
              <textarea name="reviewText" value={formData.reviewText} onChange={handleChange} placeholder="Description" rows="4" className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm resize-none" required></textarea>
            </div>

            <div className="pt-2">
              <label className="block text-lg font-bold text-black mb-2">Rating</label>
              <div className="flex items-center justify-between">
                <StarRating rating={formData.rating} setRating={handleRatingChange} interactive={true} />
                <span className="text-gray-500 text-sm">Satisfied</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center pt-6">
              <button type="submit" disabled={loading} className="px-10 py-2 rounded font-medium text-white bg-gradient-to-r from-[#b600ff] to-[#3600ff] hover:opacity-90 transition-opacity">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddReviewModal;
