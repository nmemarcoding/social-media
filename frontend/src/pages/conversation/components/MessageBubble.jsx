import React from 'react';

const MessageBubble = ({ message, isOwn, showAvatar, user }) => {
  // Format timestamp into readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fallback avatar for when user image fails to load
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23E2E8F0'/%3E%3Cpath d='M16 16C14.3431 16 13 14.6569 13 13C13 11.3431 14.3431 10 16 10C17.6569 10 19 11.3431 19 13C19 14.6569 17.6569 16 16 16ZM10 21.5C10 19.0147 12.6863 17 16 17C19.3137 17 22 19.0147 22 21.5V22H10V21.5Z' fill='%23CBD5E0'/%3E%3C/svg%3E";

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-xs md:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar (only show when needed) */}
        <div className="flex-shrink-0 h-8 w-8">
          {!isOwn && showAvatar && (
            <img 
              src={user?.profilePicture} 
              alt={user?.username || 'User'}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => { e.target.src = fallbackImage }}
            />
          )}
        </div>
        
        {/* Message content */}
        <div className={`flex flex-col ${isOwn ? 'items-end mr-2' : 'items-start ml-2'}`}>
          <div 
            className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
              isOwn 
                ? 'bg-primary-color text-white rounded-tr-none' 
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
            } ${message.pending ? 'opacity-70' : 'opacity-100'}`}
          >
            {message.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.createdAt)}
            {isOwn && (
              <span className="ml-1">
                {message.pending ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : message.read ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
