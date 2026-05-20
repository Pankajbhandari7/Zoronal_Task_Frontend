import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaStar, FaSearch, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const openLogin = () => { setIsSignupOpen(false); setIsLoginOpen(true); };
  const openSignup = () => { setIsLoginOpen(false); setIsSignupOpen(true); };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate(`/?q=${e.target.value}`);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[80px] bg-white border-b border-gray-200 z-40 shadow-sm flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <FaStar className="text-xl" />
            </div>
            <span className="text-xl font-poppins">
              <span className="font-normal text-gray-700">Review</span>
              <span className="font-bold text-gray-900">&RATE</span>
            </span>
          </Link>

          {/* Search Bar Section */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2.5 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">
              <FaSearch />
            </button>
          </div>

          {/* Auth Links Section */}
          <div className="flex items-center gap-6 text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUserCircle className="text-xl text-purple-600" />
                  <span>{user.name}</span>
                </div>
                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={openSignup} className="text-gray-700 hover:text-purple-600 transition-colors">SignUp</button>
                <button onClick={openLogin} className="text-gray-700 hover:text-purple-600 transition-colors">Login</button>
              </>
            )}
          </div>

        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToSignup={openSignup} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onSwitchToLogin={openLogin} />
    </>
  );
};

export default Navbar;
