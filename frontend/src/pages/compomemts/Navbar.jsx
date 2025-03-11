import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { removeAuthToken, removeUserInfo, getUserInfo } from '../../hooks/requestMethods';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Removed unused isMobile state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Get user info for profile picture
  const userInfo = getUserInfo() || {};
  const profilePicture = userInfo.profilePicture || "https://via.placeholder.com/32";
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      // Removed isMobile state update
      if (window.innerWidth >= 768) {
        setIsSearchOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current && 
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close search input when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isSearchOpen && 
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target) && 
        !event.target.closest('.search-toggle-btn')
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSearchOpen]);
  
  // Add keyboard navigation - close menus with Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showProfileMenu) setShowProfileMenu(false);
        if (isSearchOpen) setIsSearchOpen(false);
        if (isOpen) setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showProfileMenu, isSearchOpen, isOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const handleLogout = () => {
    removeAuthToken();
    removeUserInfo();
    setIsOpen(false);
    setShowProfileMenu(false);
    navigate('/login');
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or handle search
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };
  
  // Profile menu item click handler - closes menu
  const handleMenuItemClick = () => {
    setShowProfileMenu(false);
  };
  
  // Check if route is active - more flexible to handle nested routes
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle profile image loading error
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/32";
  };
  
  return (
    <>
      {/* Top Navbar */}
      <header>
        <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 left-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-14 md:h-16">
              {/* Logo Section - Left on Mobile, Centered on Desktop */}
              <div className="flex-shrink-0 flex md:absolute md:left-4 md:top-1/2 md:transform md:-translate-y-1/2">
                <Link to="/" className="font-semibold text-xl text-gray-900">
                  SocialApp
                </Link>
              </div>
              
              {/* Search Bar - Hidden on Mobile, Visible on Desktop */}
              <div className="hidden md:flex items-center justify-center flex-grow">
                <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-1.5 px-10 bg-gray-100 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    aria-label="Search"
                  />
                  <button 
                    type="submit" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label="Submit search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
              
              {/* Desktop Navigation Icons */}
              <div className="hidden md:flex items-center space-x-5">
                <Link to="/" className={`p-1 rounded-md hover:scale-110 transition-transform ${isActive('/') ? 'text-black' : 'text-gray-500'}`} aria-label="Home">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                
                <Link to="/explore" className={`p-1 rounded-md hover:scale-110 transition-transform ${isActive('/explore') ? 'text-black' : 'text-gray-500'}`} aria-label="Explore">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Link>
                
                <Link to="/messages" className={`p-1 rounded-md hover:scale-110 transition-transform ${isActive('/messages') ? 'text-black' : 'text-gray-500'}`} aria-label="Messages">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
                
                <Link to="/notifications" className={`p-1 rounded-md hover:scale-110 transition-transform ${isActive('/notifications') ? 'text-black' : 'text-gray-500'}`} aria-label="Notifications">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>
                
                {/* Profile Button with Dropdown */}
                <div className="relative">
                  <button
                    ref={profileButtonRef}
                    onClick={toggleProfileMenu}
                    className={`p-0.5 rounded-full border-2 ${showProfileMenu ? 'border-black' : 'border-transparent'} hover:border-gray-300 focus:outline-none transition-all`}
                    aria-label="Profile menu"
                    aria-expanded={showProfileMenu}
                    aria-controls="profile-menu"
                  >
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-7 w-7 rounded-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div 
                      id="profile-menu"
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                      role="menu"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Menu Button - Only Visible on Small Screens */}
              <div className="flex items-center md:hidden">
                <button 
                  onClick={toggleMenu} 
                  className="p-2 rounded-md focus:outline-none"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-gray-700 ${isOpen ? 'hidden' : 'block'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-gray-700 ${isOpen ? 'block' : 'hidden'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          <div 
            className={`md:hidden bg-white ${isOpen ? 'block' : 'hidden'} shadow-lg border-t border-gray-200 px-4 py-2`}
            id="mobile-menu"
            role="menu"
          >
            <div className="py-2">
              <Link 
                to="/settings" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Log Out
              </button>
            </div>
          </div>
          
          {/* Mobile Search Input - Appears when search is toggled */}
          {isSearchOpen && (
            <div 
              ref={searchInputRef}
              className="search-input-container md:hidden fixed top-14 left-0 right-0 bg-white shadow-md px-4 py-3 z-30 border-b border-gray-200 animate-fadeIn"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search users, posts, or tags..."
                  className="w-full py-2 px-10 bg-gray-100 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-color"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  aria-label="Search"
                />
                <button 
                  type="submit" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-label="Submit search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setIsSearchOpen(false)}
                  type="button"
                  aria-label="Close search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </nav>
      </header>
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex justify-around items-center h-14" role="navigation">
        <Link to="/" className={`p-1.5 ${isActive('/') ? 'text-black' : 'text-gray-500'}`} aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        
        {/* Search Button (replaced Link with button) */}
        <button 
          onClick={toggleSearch} 
          className={`p-1.5 search-toggle-btn ${isActive('/search') || isSearchOpen ? 'text-black' : 'text-gray-500'}`}
          aria-label="Search"
          aria-expanded={isSearchOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <Link to="/explore" className={`p-1.5 ${isActive('/explore') ? 'text-black' : 'text-gray-500'}`} aria-label="Explore">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Link>
        
        <Link to="/notifications" className={`p-1.5 ${isActive('/notifications') ? 'text-black' : 'text-gray-500'}`} aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Link>
        
        <Link to="/profile" className={`p-0.5 ${isActive('/profile') ? 'border-2 border-black rounded-full' : 'border-2 border-transparent'}`} aria-label="Profile">
          <img
            src={profilePicture}
            alt="Profile"
            className="h-6 w-6 rounded-full object-cover"
            onError={handleImageError}
          />
        </Link>
      </div>
      
      {/* Add padding to bottom of page content for mobile navigation */}
      <div className="md:hidden pb-14"></div>
    </>
  );
};

export default Navbar;
