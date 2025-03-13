import React from 'react';

const ConversationItem = ({ conversation, currentUserId, onClick }) => {
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants[0];
  const { lastMessage } = conversation;
  
  // Check if message is unread (only if sent by the other user)
  const isUnread = !lastMessage.read && lastMessage.sender !== currentUserId;
  
  // Format timestamp
  const formatMessageTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week, show day name
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older, show date
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Format message preview (add "You: " if the current user sent the last message)
  const getMessagePreview = () => {
    if (lastMessage.sender === currentUserId) {
      return `You: ${lastMessage.content}`;
    }
    return lastMessage.content;
  };

  return (
    <div 
      onClick={onClick}
      className="px-4 py-3 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {/* Profile Picture */}
      <div className="flex-shrink-0 relative">
        <img 
          src={otherParticipant.profilePicture || "https://via.placeholder.com/40"} 
          alt={`${otherParticipant.username}'s profile`}
          className="h-14 w-14 rounded-full object-cover border border-gray-200"
          onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
        />
        {otherParticipant.isOnline && (
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      {/* Message Content */}
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <h3 className={`font-medium truncate ${isUnread ? 'text-black font-semibold' : 'text-gray-900'}`}>
            {`${otherParticipant.firstName} ${otherParticipant.lastName}`}
          </h3>
          <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {formatMessageTime(lastMessage.createdAt)}
          </span>
        </div>
        <div className="flex items-center">
          <p className={`text-sm truncate ${isUnread ? 'text-black font-medium' : 'text-gray-500'}`}>
            {getMessagePreview()}
          </p>
          {isUnread && (
            <div className="ml-2 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
