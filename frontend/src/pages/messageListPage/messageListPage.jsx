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

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from your actual endpoint
        const response = await publicRequest().get('/messages/conversations');

        // Transform the API response to match our existing UI structure
        // Each conversation will have:
        //  - an 'id' we can use for navigation (in this example, I'll use the partner's _id)
        //  - a 'participants' array with just the partner
        //  - a 'lastMessage' object with fields content, createdAt, sender, and read
        const transformedData = (response.data || []).map((item) => {
          return {
            id: item.partner._id, // or any unique identifier you want to use
            participants: [
              {
                _id: item.partner._id,
                username: item.partner.username,
                firstName: item.partner.firstName,
                lastName: item.partner.lastName,
                // If your API doesn't provide a profile picture, you can keep this blank or use a placeholder
                profilePicture: '',
              },
            ],
            lastMessage: {
              content: item.lastMessage?.content || '',
              createdAt: item.lastMessage?.createdAt || null,
              // Depending on your usage, you can distinguish the sender name/ID for display logic
              sender: item.lastMessage?.senderId || '',
              // Convert the 'seen' field to match your existing 'read' usage
              read: item.lastMessage?.seen ?? false,
            },
            // If needed, you can also keep track of the unreadCount
            unreadCount: item.unreadCount,
          };
        });

        setConversations(transformedData);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError("Couldn't load your messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const participant = conversation.participants[0];
    const name = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    const username = participant.username.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    return name.includes(searchLower) || username.includes(searchLower);
  });

  // Navigate to conversation detail
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
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
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
            // No results for search
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
