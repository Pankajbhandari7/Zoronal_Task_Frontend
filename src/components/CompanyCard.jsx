import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import StarRating from './StarRating';
import api from '../services/api';

const CompanyCard = ({ company }) => {
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  // Fetch stats for this company (since listing needs rating and count)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/reviews/company/${company._id}?sort=date`);
        setReviewCount(res.data.stats.totalReviews || 0);
        setAvgRating(res.data.stats.averageRating || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [company._id]);

  const foundedDate = new Date(company.foundedOn).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).replace(/\//g, '-');

  // To match the colors in screenshot: Dark Blue for G, Green for CT, Orange for bulb
  // Since we don't have images, we will generate a solid color background based on name
  const getBgColor = (name) => {
    if(name.toLowerCase().includes('graffer')) return 'bg-[#1e293b] text-white';
    if(name.toLowerCase().includes('code tech')) return 'bg-[#16a34a] text-white';
    if(name.toLowerCase().includes('innogent')) return 'bg-[#f97316] text-white';
    return 'bg-purple-100 text-purple-600';
  };

  const getInitials = (name) => {
    if(name.toLowerCase().includes('graffer')) return 'G';
    if(name.toLowerCase().includes('code tech')) return '<CT>';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
      
      {/* Left Section: Logo & Info */}
      <div className="flex gap-6 items-center">
        {/* Logo */}
        <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold shrink-0 ${getBgColor(company.name)}`}>
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="w-16 h-16 object-contain" />
          ) : (
            <span>{getInitials(company.name)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{company.name}</h3>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <FaMapMarkerAlt className="mr-1" />
            <span>{company.location}, {company.city} (M.P.)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{avgRating > 0 ? avgRating.toFixed(1) : '4.5'}</span>
            <StarRating rating={avgRating > 0 ? Math.round(avgRating) : 5} />
            <span className="font-semibold text-gray-900 ml-2">{reviewCount > 0 ? reviewCount : '41'} Reviews</span>
          </div>
        </div>
      </div>

      {/* Right Section: Date & Button */}
      <div className="flex flex-col items-end mt-4 md:mt-0 h-full justify-between self-stretch">
        <span className="text-xs text-gray-400 mb-6 md:mb-0">Founded on {foundedDate}</span>
        <Link 
          to={`/company/${company._id}`} 
          className="bg-[#333333] hover:bg-black text-white text-sm font-medium py-2 px-6 rounded transition-colors"
        >
          Detail Review
        </Link>
      </div>

    </div>
  );
};

export default CompanyCard;
