import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import AddReviewModal from '../components/AddReviewModal';

const CompanyPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCompanyData();
  }, [id, sort]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const [compRes, revRes] = await Promise.all([
        api.get(`/companies/${id}`),
        api.get(`/reviews/company/${id}?sort=${sort}`)
      ]);
      setCompany(compRes.data);
      setReviews(revRes.data.reviews);
      setStats(revRes.data.stats);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    fetchCompanyData(); // Refresh to update stats and list
  };

  if (loading && !company) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!company) return <div className="text-center py-20 text-gray-500">Company not found</div>;

  const fd = new Date(company.foundedOn);
  const foundedDate = isNaN(fd.getTime()) 
    ? '' 
    : `${String(fd.getDate()).padStart(2, '0')}-${String(fd.getMonth() + 1).padStart(2, '0')}-${fd.getFullYear()}`;

  // Generate solid color background based on name (matching CompanyCard logic)
  const getBgColor = (name) => {
    if(name.toLowerCase().includes('graffer')) return 'bg-[#0C1236] text-white';
    if(name.toLowerCase().includes('code tech')) return 'bg-[#298000] text-white';
    if(name.toLowerCase().includes('innogent')) return 'bg-[#FF7B01] text-white';
    return 'bg-purple-100 text-purple-600';
  };

  const getInitials = (name) => {
    if(name.toLowerCase().includes('graffer'))  return (
      <img
        src="/images/GLogo.png"
        alt="Graffer"
        className="w-full h-full object-cover rounded-md"
      />
    );
    if(name.toLowerCase().includes('code tech')) return '<CT>';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 mt-12 pb-20">
      
      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
        
        {/* Company Header */}
        <div className="flex gap-6 relative">
          <div className={`w-[110px] h-[110px] rounded-md flex items-center justify-center text-4xl font-bold shrink-0 ${getBgColor(company.name)}`}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover rounded-md" />
            ) : (
              <span>{getInitials(company.name)}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-[20px] font-bold text-gray-800">{company.name}</h1>
                <span className="text-[11px] text-gray-400">Founded on {foundedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mt-1">
                <FaMapMarkerAlt /> {company.location}{company.city ? `, ${company.city}` : ''}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[15px] text-black">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                </span>
                <div className="flex text-yellow-400 text-[15px]">
                  <StarRating rating={Math.round(stats.averageRating)} />
                </div>
                <span className="text-[13px] font-bold text-black ml-1">{stats.totalReviews} Reviews</span>
              </div>

              <button 
                className="bg-gradient-to-r from-[#8f00ff] to-[#2500ff] text-white px-5 py-2 rounded font-medium text-[13px] hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Review
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 my-6" />

        {/* Reviews Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-[12px] text-gray-400">Result Found: {reviews.length}</div>
            
            {/* Preserved Sort Dropdown (hidden in screenshot but required by functionality) */}
            <select 
              className="bg-transparent text-gray-400 text-[11px] focus:outline-none cursor-pointer"
              value={sort} 
              onChange={e => setSort(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="relevance">Sort by Relevance</option>
            </select>
          </div>

          <div className="space-y-0">
            {reviews.length > 0 ? (
              reviews.map(review => <ReviewCard key={review._id} review={review} />)
            ) : (
              <div className="py-12 text-center text-gray-500 text-sm">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>

      </div>

      <AddReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        companyId={id} 
        onAdd={handleReviewAdded} 
      />
    </div>
  );
};

export default CompanyPage;
