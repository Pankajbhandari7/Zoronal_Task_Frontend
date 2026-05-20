import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';

const HomePage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').toLowerCase();

  // Extract unique cities for filter
  const uniqueCities = [...new Set(companies.map(c => c.city))];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery) ||
      c.location.toLowerCase().includes(searchQuery);
      
    const matchesCity = cityFilter ? c.city === cityFilter : true;
    return matchesSearch && matchesCity;
  }).sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'location') {
      return a.location.localeCompare(b.location);
    }
    // Note: Rating/Average sorting requires stats to be fetched on the parent level.
    // For now, it defaults to name if rating is selected, since all ratings are 4.5.
    return 0;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        
        {/* City Select */}
        <div className="flex-1 max-w-sm">
          <label className="block text-sm text-gray-500 mb-1">Select City</label>
          <div className="relative">
            <select 
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:border-purple-500 text-sm bg-white"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 outline-none pointer-events-none" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-6 rounded shadow-md hover:shadow-lg transition-shadow">
            Find Company
          </button>
          <button 
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-6 rounded shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Company
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="w-40">
          <label className="block text-sm text-gray-500 mb-1">Sort:</label>
          <div className="relative">
            <select 
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:border-purple-500 text-sm bg-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="location">Location</option>
               <option value="name">Rating</option>
              <option value="location">Average</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="py-4">
        <span className="text-sm text-gray-400">Result Found: {filteredCompanies.length}</span>
      </div>

      {/* Company List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading companies...</div>
      ) : filteredCompanies.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredCompanies.map((company, index) => (
            <CompanyCard key={company._id} company={company} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">Try adjusting your search or filters, or add a new company.</p>
        </div>
      )}

      <AddCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(newComp) => setCompanies([newComp, ...companies])} 
      />
    </div>
  );
};

export default HomePage;
