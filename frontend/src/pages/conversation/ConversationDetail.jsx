import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserInfo } from '../../hooks/requestMethods'; // Removed publicRequest since it's not used
import ConversationHeader from './components/ConversationHeader';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';

const ConversationDetail = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  // Removed conversation state since it's not used
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageEndRef = useRef(null);
  const currentUser = getUserInfo() || {};

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be API calls
        // For now, let's simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock other user data
        const mockOtherUser = {
          _id: '2',
          username: 'janedoe',
          firstName: 'Jane',
          lastName: 'Doe',
          profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg'
        };
        
        // Mock conversation data - now used for reference only
        // const mockConversation = {
        //   _id: conversationId,
        //   participants: [currentUser.id, mockOtherUser._id],
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString()
        // };
        
        // Mock messages
        const mockMessages = [
          {
            _id: '1',
            conversationId,
            sender: mockOtherUser._id,
            content: 'Hey there! How are you doing?',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: true
          },
          {
            _id: '2',
            conversationId,
            sender: currentUser.id,
            content: 'I\'m good, thanks for asking! Just working on a new project.',
            createdAt: new Date(Date.now() - 85000000).toISOString(),
            read: true
          },
          {
            _id: '3',
            conversationId,
            sender: mockOtherUser._id,
            content: 'Oh nice! What kind of project are you working on?',
            createdAt: new Date(Date.now() - 84000000).toISOString(),
            read: true
          },
          {
            _id: '4',
            conversationId,
            sender: currentUser.id,
            content: 'It\'s a social media app similar to Instagram, but with some unique features.',
            createdAt: new Date(Date.now() - 80000000).toISOString(),
            read: true
          },
          {
            _id: '5',
            conversationId,
            sender: mockOtherUser._id,
            content: 'That sounds really interesting! I\'d love to check it out when it\'s ready.',
            createdAt: new Date(Date.now() - 79000000).toISOString(),
            read: true
          },
          {
            _id: '6',
            conversationId,
            sender: currentUser.id,
            content: 'Sure! I\'ll share the link once it\'s launched. Are you still working at that tech company?',
            createdAt: new Date(Date.now() - 75000000).toISOString(),
            read: true
          },
          {
            _id: '7',
            conversationId,
            sender: mockOtherUser._id,
            content: 'Yes, I am. It\'s been pretty hectic lately with all the deadlines, but I enjoy the work.',
            createdAt: new Date(Date.now() - 70000000).toISOString(),
            read: true
          },
          {
            _id: '8',
            conversationId,
            sender: currentUser.id,
            content: 'I know that feeling! Deadlines can be stressful, but it\'s great that you enjoy what you do.',
            createdAt: new Date(Date.now() - 60000000).toISOString(),
            read: true
          },
          {
            _id: '9',
            conversationId,
            sender: mockOtherUser._id,
            content: 'Absolutely! Hey, we should catch up sometime soon in person. It\'s been a while!',
            createdAt: new Date(Date.now() - 30000000).toISOString(),
            read: false
          }
        ];
        
        setOtherUser(mockOtherUser);
        // Removed setConversation since we're not using it
        setMessages(mockMessages);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
  }, [conversationId, currentUser.id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (content) => {
    if (!content.trim()) return;
    
    // In a real app, this would be an API call to send the message
    const newMessage = {
      _id: `new-${Date.now()}`,
      conversationId,
      sender: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      read: false,
      pending: true
    };
    
    // Add message to the list
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Simulate API call success after delay
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === newMessage._id 
            ? { ...msg, pending: false } 
            : msg
        )
      );
    }, 1000);
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      {otherUser && (
        <ConversationHeader 
          user={otherUser} 
          onBack={handleBack} 
        />
      )}
      
      {/* Messages Container */}
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
      
      {/* Message Input Area */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ConversationDetail;
