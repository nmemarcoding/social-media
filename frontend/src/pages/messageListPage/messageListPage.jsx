import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest, getUserInfo } from '../../hooks/requestMethods';
import ConversationItem from './components/ConversationItem';
import EmptyState from './components/EmptyState';

const MessageListPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const currentUser = getUserInfo() || {};

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data from the endpoint
        const response = await publicRequest().get('/messages/conversations');
        console.log('Conversations Data:', response.data);
        
        // Transform the API data for the UI
        const transformedData = (response.data || []).map((item) => {
          return {
            // Use the partner’s _id as a unique identifier (can be changed as needed)
            id: item.partner._id,

            // Create a participants array with the partner’s info
            participants: [
              {
                _id: item.partner._id,
                username: item.partner.username,
                firstName: item.partner.firstName,
                lastName: item.partner.lastName || '', // Optional if lastName might be missing
                profilePicture: item.partner.profilePicture || '', // Use provided profile image
              },
            ],

            // Map lastMessage to match the existing shape
            lastMessage: {
              content: item.lastMessage?.content || '',
              createdAt: item.lastMessage?.createdAt || null,
              sender: item.lastMessage?.senderId || '',
              // Convert 'seen' to 'read' for consistency with the UI
              read: item.lastMessage?.seen ?? false,
            },
            // Capture unreadCount if needed
            unreadCount: item.unreadCount,
          };
        });

        setConversations(transformedData);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        setError("Couldn't load your messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Filter conversations based on search input
  const filteredConversations = conversations.filter((conversation) => {
    const participant = conversation.participants[0];
    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    const username = participant.username.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
  

    return fullName.includes(searchLower) || username.includes(searchLower);
  });

  // Navigate to the conversation detail page
  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white min-h-screen md:my-4 md:rounded-lg md:shadow-sm">
        {/* Header Section */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 md:rounded-t-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>

            {/* Search input */}
            <div className="relative w-full max-w-xs ml-4">
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 01-14 0z" 
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Message List Section */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading messages...</p>
            </div>
          ) : error && conversations.length === 0 ? (
            // Error state
            <div className="p-6 text-center">
              <div className="text-red-500 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 1118 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredConversations.length > 0 ? (
            // Conversations list
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUser.id}
                onClick={() => handleConversationClick(conversation.id)}
              />
            ))
          ) : searchQuery ? (
            // No results for the search term
            <div className="p-8 text-center">
              <p className="text-gray-500">
                No conversations found for "{searchQuery}"
              </p>
            </div>
          ) : (
            // Empty state - no messages
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageListPage;
