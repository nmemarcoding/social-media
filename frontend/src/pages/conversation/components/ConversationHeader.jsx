import React from 'react';
import { Link } from 'react-router-dom';

const ConversationHeader = ({ user, onBack }) => {
  // Fallback image for when user image fails to load
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E2E8F0'/%3E%3Cpath d='M20 20C17.7909 20 16 18.2091 16 16C16 13.7909 17.7909 12 20 12C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20ZM12 28C12 24.6863 15.5817 22 20 22C24.4183 22 28 24.6863 28 28H12Z' fill='%23CBD5E0'/%3E%3C/svg%3E";

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* User Info */}
      <Link to={`/profile/${user.username}`} className="flex items-center">
        <div className="relative">
          <img 
            src={user.profilePicture} 
            alt={user.username}
            className="w-9 h-9 rounded-full object-cover"
            onError={(e) => { e.target.src = fallbackImage }}
          />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white"></span>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-sm text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            @{user.username}
          </p>
        </div>
      </Link>
      
      {/* Extra options */}
      <div className="ml-auto">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="More options">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
