import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserInfo, publicRequest } from '../../hooks/requestMethods';
import ConversationHeader from './components/ConversationHeader';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';

const ConversationDetail = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageEndRef = useRef(null);
  const currentUser = getUserInfo() || {};
  const { userId } = useParams();
  
  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        setLoading(true);
        
        // Get conversation history with the userId
        const response = await publicRequest().get(`/messages/history/${userId}`);
        const data = response.data;
     
        
        // Get current user ID from the stored user info
        const currentUserId = currentUser.id;
        
        // Find the other user in the conversation based on the userId param
        const foundOtherUser = data.users[userId];
        
        if (!foundOtherUser) {
          throw new Error("User not found");
        }
        
        // Filter and format messages between current user and other user
        const conversationMessages = data.messages.filter(msg => 
          (msg.senderId === currentUserId && msg.receiverId === userId) || 
          (msg.senderId === userId && msg.receiverId === currentUserId)
        );
        
        // Sort messages by date and format them
        const formattedMessages = conversationMessages
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map(msg => ({
            _id: msg._id,
            conversationId: userId, // Use userId as conversationId
            sender: msg.senderId,
            content: msg.content,
            createdAt: msg.createdAt,
            read: msg.seen
          }));
        
        setOtherUser(foundOtherUser);
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchConversationData();
    }
  }, [userId, currentUser.id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Create a temporary message to show in the UI immediately
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: userId,
      sender: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      read: false,
      pending: true
    };
    
    // Add the temporary message to the UI
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    try {
      // Send the message to the API
      const response = await publicRequest().post(`messages/${userId}`, {
        receiverId: userId,
        content: content.trim()
      });
      
      // Replace the temporary message with the real one from the API
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempMessage._id 
            ? {
                _id: response.data._id || tempMessage._id,
                conversationId: userId,
                sender: currentUser.id,
                content,
                createdAt: response.data.createdAt || tempMessage.createdAt,
                read: false,
                pending: false
              } 
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // Mark the message as failed
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempMessage._id 
            ? { ...msg, pending: false, failed: true } 
            : msg
        )
      );
    }
  };

  const handleBack = () => {
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
        <span className="ml-3 text-gray-600">Loading conversation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Error Loading Conversation</h3>
        <p className="mt-1 text-gray-500">{error}</p>
        <button 
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover"
        >
          Return to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-0 sm:pb-0 md:pb-0 pb-16">
      {otherUser && (
        <ConversationHeader 
          user={otherUser} 
          onBack={handleBack} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <MessageBubble 
            key={message._id}
            message={message}
            isOwn={message.sender === currentUser.id}
            showAvatar={index === 0 || messages[index - 1]?.sender !== message.sender}
            user={message.sender === currentUser.id ? currentUser : otherUser}
          />
        ))}
        <div ref={messageEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ConversationDetail;
