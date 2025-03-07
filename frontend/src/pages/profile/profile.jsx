import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../hooks/requestMethods';
import './profile.css';

// Import components
import ProfileHeader from './components/ProfileHeader';
import CreatePostForm from './components/CreatePostForm';
import PostsGrid from './components/PostsGrid';

export default function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Get profile data from local storage or use default values
    const profileUser = JSON.parse(localStorage.getItem('user')) || {
        id: '1',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software developer and photography enthusiast. Love hiking and exploring new places.',
        profilePicture: 'https://placehold.co/150',
        friendsCount: 248
    };
    
    // Posts state
    const [posts, setPosts] = useState([]);
    
    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await publicRequest().get('/posts/timeline/all');
                setPosts(res.data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setError("Failed to load posts. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPosts();
    }, []);
    
    // Static hardcoded relationship status
    const relationshipStatus = { status: 'pending' };
    
    // Static flag for own profile
    const isOwnProfile = true;
    
    // Handle creating a new post - now uses the API
    const handleCreatePost = async (content, media, callback) => {
        setError(null);
        
        try {
            // Make API request to create post
            const response = await publicRequest().post('/posts', {
                content,
                media: media || ''
            });
            
            // Add the new post from API response to the posts array
            setPosts([response.data, ...posts]);
            
            // Call the callback to reset form
            callback();
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.error || 'Failed to create post. Please try again.');
            // Still call callback to reset form state
            callback();
        }
    };
    
    // Simplified event handlers
    const handleFollow = () => {
        console.log('Follow action triggered');
    };
    
    const handleUnfollow = () => {
        console.log('Unfollow action triggered');
    };
    
    const handleMessage = () => {
        console.log('Message action triggered');
        navigate('/messages/1'); // Using hardcoded user ID
    };

    return (
        <div className="profile">
            <div className="profileContainer">
                <ProfileHeader 
                    profileUser={profileUser}
                    isOwnProfile={isOwnProfile}
                    relationshipStatus={relationshipStatus}
                    postsCount={posts.length}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    handleMessage={handleMessage}
                />
                
                <div className="profileTabs">
                    <div className="profileTab active">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                            <path fill="currentColor" d="M5 5h14v14H5z"/>
                        </svg>
                        Posts
                    </div>
                </div>
                
                {/* Show error if it exists */}
                {error && <div className="error-message">{error}</div>}
                
                {/* New Post Creation Section */}
                {isOwnProfile && (
                    <CreatePostForm 
                        profileUser={profileUser} 
                        onSubmit={handleCreatePost}
                    />
                )}
                
                {/* Show loading state or posts */}
                {isLoading ? (
                    <div className="loading-message">Loading posts...</div>
                ) : (
                    <PostsGrid 
                        posts={posts} 
                        profileUser={profileUser} 
                        isOwnProfile={isOwnProfile} 
                    />
                )}
            </div>
        </div>
    );
}
