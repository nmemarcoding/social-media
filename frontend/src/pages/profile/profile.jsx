import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

// Import components
import ProfileHeader from './components/ProfileHeader';
import CreatePostForm from './components/CreatePostForm';
import PostsGrid from './components/PostsGrid';

export default function Profile() {
    const navigate = useNavigate();
    
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
    
    // Static posts data - converted to state to allow adding new posts
    const [posts, setPosts] = useState([
        {
            _id: '1',
            content: 'Beautiful sunset today!',
            media: 'https://placehold.co/400x400/orange/white?text=Sunset',
            likesCount: 42
        },
        {
            _id: '2',
            content: 'My new coding setup',
            media: 'https://placehold.co/400x400/blue/white?text=Setup',
            likesCount: 28
        },
        {
            _id: '3',
            content: 'Weekend hiking trip',
            media: 'https://placehold.co/400x400/green/white?text=Hiking',
            likesCount: 35
        },
        {
            _id: '4',
            content: 'Learning new tech',
            media: 'https://placehold.co/400x400/purple/white?text=Tech',
            likesCount: 19
        }
    ]);
    
    // Static hardcoded relationship status
    const relationshipStatus = { status: 'pending' };
    
    // Static flag for own profile
    const isOwnProfile = true;
    
    // Handle creating a new post
    const handleCreatePost = (content, media, callback) => {
        // Simulate API delay
        setTimeout(() => {
            // Create a new post object
            const newPost = {
                _id: `new-${Date.now()}`, // Generate temporary ID
                content: content,
                media: media || '',
                likesCount: 0,
                createdAt: new Date().toISOString()
            };
            
            // Add the new post to the posts array
            setPosts([newPost, ...posts]);
            
            // Call the callback to reset form
            callback();
        }, 1000);
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
                
                {/* New Post Creation Section */}
                {isOwnProfile && (
                    <CreatePostForm 
                        profileUser={profileUser} 
                        onSubmit={handleCreatePost}
                    />
                )}
                
                <PostsGrid 
                    posts={posts} 
                    profileUser={profileUser} 
                    isOwnProfile={isOwnProfile} 
                />
            </div>
        </div>
    );
}
