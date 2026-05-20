import React, { useState } from 'react';
import { FaTimes, FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import api from '../services/api';

const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    foundedOn: '',
   
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/companies', formData);
      onAdd(res.data);
      onClose();
      setFormData({ name: '', location: '', city: '', foundedOn:  '',  });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000] p-4 font-poppins">
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
          <h2 className="text-2xl font-bold text-black mt-2">Add Company</h2>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 relative z-10 mt-2 max-h-[80vh] overflow-y-auto">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-gray-400 mb-1 text-[#959595]  font-poppins">Company name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter..." className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" required />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Location</label>
              <div className="relative">
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Select Location" className="w-full pl-3 pr-10 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" required />
                <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Founded on</label>
              <div className="relative">
                <input type="date" name="foundedOn" value={formData.foundedOn} onChange={handleChange} className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm text-gray-500 appearance-none bg-transparent relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full" required />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-0" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" required />
            </div>

            {/* These were not in the screenshot but kept to preserve functionality */}
            {/* <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Logo URL</label>
              <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm" />
            </div> */}

            {/* <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2.5 rounded border border-gray-200 focus:border-purple-500 outline-none text-sm resize-none"></textarea>
            </div> */}

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

export default AddCompanyModal;
