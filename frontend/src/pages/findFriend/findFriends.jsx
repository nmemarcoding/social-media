import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest, getUserInfo } from '../../hooks/requestMethods';

const FindFriends = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationships, setRelationships] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [actionInProgress, setActionInProgress] = useState(null);
  
  const currentUser = getUserInfo() || {};
  
  // Fetch all users and relationships on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for static display - would be replaced with actual API calls
        const mockUsers = [
          {
            id: '1',
            username: 'janedoe',
            firstName: 'Jane',
            lastName: 'Doe',
            bio: 'UX Designer. Coffee enthusiast. Dog lover.',
            profilePicture: 'https://placehold.co/150?text=Jane',
            friendsCount: 125
          },
          {
            id: '2',
            username: 'mikesmith',
            firstName: 'Mike',
            lastName: 'Smith',
            bio: 'Photographer and travel blogger. Always exploring.',
            profilePicture: 'https://placehold.co/150?text=Mike',
            friendsCount: 87
          },
          {
            id: '3',
            username: 'sarah_j',
            firstName: 'Sarah',
            lastName: 'Johnson',
            bio: 'Marketing specialist. Book lover and aspiring author.',
            profilePicture: 'https://placehold.co/150?text=Sarah',
            friendsCount: 213
          },
          {
            id: '4',
            username: 'alex_tech',
            firstName: 'Alex',
            lastName: 'Brown',
            bio: 'Software engineer. Open source contributor.',
            profilePicture: 'https://placehold.co/150?text=Alex',
            friendsCount: 156
          },
          {
            id: '5',
            username: 'lisa_design',
            firstName: 'Lisa',
            lastName: 'Chen',
            bio: 'Graphic designer. Art enthusiast.',
            profilePicture: 'https://placehold.co/150?text=Lisa',
            friendsCount: 92
          },
          {
            id: '6',
            username: 'david_m',
            firstName: 'David',
            lastName: 'Miller',
            bio: 'Fitness coach. Helping people achieve their goals.',
            profilePicture: 'https://placehold.co/150?text=David',
            friendsCount: 178
          },
          {
            id: '7',
            username: 'emma_w',
            firstName: 'Emma',
            lastName: 'Wilson',
            bio: 'Chef and food blogger. Sharing delicious recipes.',
            profilePicture: 'https://placehold.co/150?text=Emma',
            friendsCount: 142
          },
          {
            id: '8',
            username: 'kevin_p',
            firstName: 'Kevin',
            lastName: 'Park',
            bio: 'Music producer. Always creating new beats.',
            profilePicture: 'https://placehold.co/150?text=Kevin',
            friendsCount: 105
          }
        ];
        
        // Mock relationship data
        const mockRelationships = {
          '2': 'accepted', // Friends with Mike
          '3': 'pending_sent', // Request sent to Sarah
          '5': 'pending_received', // Request received from Lisa
          '7': 'blocked' // Blocked Emma
        };
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setRelationships(mockRelationships);
        
        // In a real implementation, we would fetch users and relationships:
        // const userResponse = await publicRequest().get('/users');
        // const relationshipResponse = await publicRequest().get('/relationship/status');
        // setUsers(userResponse.data);
        // setFilteredUsers(userResponse.data);
        // setRelationships(relationshipResponse.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(query) || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);
  
  // Handle friend request actions
  const handleFriendAction = async (userId, action) => {
    setActionInProgress(userId);
    
    try {
      // In a real implementation, these would be actual API calls
      // For now, we'll simulate by updating the local state
      
      switch(action) {
        case 'send_request':
          // await publicRequest().post(`/relationship/request/${userId}`);
          setRelationships(prev => ({ ...prev, [userId]: 'pending_sent' }));
          break;
        case 'accept_request':
          // await publicRequest().put(`/relationship/accept/${userId}`);
          setRelationships(prev => ({ ...prev, [userId]: 'accepted' }));
          break;
        case 'cancel_request':
          // await publicRequest().delete(`/relationship/request/${userId}`);
          setRelationships(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
          });
          break;
        case 'remove_friend':
          // await publicRequest().delete(`/relationship/friend/${userId}`);
          setRelationships(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
          });
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Failed to ${action} for user ${userId}:`, err);
      setError(`Failed to perform action. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Render appropriate button based on relationship status
  const renderActionButton = (user) => {
    // Don't show actions for current user
    if (user.id === currentUser.id) {
      return null;
    }
    
    const relationshipStatus = relationships[user.id];
    const isInProgress = actionInProgress === user.id;
    
    switch(relationshipStatus) {
      case 'accepted':
        return (
          <button 
            onClick={() => handleFriendAction(user.id, 'remove_friend')}
            disabled={isInProgress}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium flex items-center justify-center"
          >
            {isInProgress ? (
              <span className="inline-block h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
              </svg>
            )}
            Friends
          </button>
        );
      case 'pending_sent':
        return (
          <button 
            onClick={() => handleFriendAction(user.id, 'cancel_request')}
            disabled={isInProgress}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium flex items-center justify-center"
          >
            {isInProgress ? (
              <span className="inline-block h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            Cancel Request
          </button>
        );
      case 'pending_received':
        return (
          <div className="flex space-x-2">
            <button 
              onClick={() => handleFriendAction(user.id, 'accept_request')}
              disabled={isInProgress}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center"
            >
              {isInProgress ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Accept'}
            </button>
            <button 
              onClick={() => handleFriendAction(user.id, 'cancel_request')}
              disabled={isInProgress}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium"
            >
              {isInProgress ? (
                <span className="inline-block h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
              ) : 'Decline'}
            </button>
          </div>
        );
      case 'blocked':
        return (
          <button 
            disabled
            className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-md font-medium flex items-center justify-center opacity-80"
          >
            Blocked
          </button>
        );
      default:
        return (
          <button 
            onClick={() => handleFriendAction(user.id, 'send_request')}
            disabled={isInProgress}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center"
          >
            {isInProgress ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            Add Friend
          </button>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Find Friends</h1>
          
          <div className="relative w-full sm:w-64 lg:w-72">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      
        {error && (
          <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-700">No users found</p>
            <p className="mt-2 text-gray-500">Try adjusting your search query or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <Link to={`/profile/${user.username}`} className="block">
                      <img 
                        src={user.profilePicture} 
                        alt={`${user.firstName} ${user.lastName}`} 
                        className="h-14 w-14 object-cover rounded-full border-2 border-gray-100"
                      />
                    </Link>
                    <div className="ml-4">
                      <Link to={`/profile/${user.username}`} className="block">
                        <h3 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                        <p className="text-gray-500 text-sm">@{user.username}</p>
                      </Link>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">{user.bio}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div>
                      <span className="font-medium text-gray-900">{user.friendsCount}</span> friends
                    </div>
                    {relationships[user.id] === 'pending_received' && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        Request Received
                      </span>
                    )}
                    {relationships[user.id] === 'pending_sent' && (
                      <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                        Request Sent
                      </span>
                    )}
                  </div>
                  {renderActionButton(user)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindFriends;
