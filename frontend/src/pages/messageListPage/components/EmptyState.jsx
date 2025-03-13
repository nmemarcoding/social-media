import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Connect with friends and start sharing moments through direct messages.
      </p>
      <Link 
        to="/find-friends" 
        className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        Find Friends
      </Link>
    </div>
  );
};

export default EmptyState;
