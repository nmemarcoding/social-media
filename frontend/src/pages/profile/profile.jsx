import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicRequest } from '../../hooks/requestMethods';

// Import components
import ProfileHeader from './components/ProfileHeader';
import CreatePostForm from './components/CreatePostForm';
import PostsGrid from './components/PostsGrid';
import PostModal from './components/PostModal';

export default function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [profileData, setProfileData] = useState(null);
    // get username from url params and set that to useStates
    const { username } = useParams();
    
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
    // Add state for isOwnProfile
    const [isOwnProfile, setIsOwnProfile] = useState(true);
    
    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setIsPrivate(false); // Reset private state
            setError(null); // Reset error state
            // if username from promt exist use posts/user-posts?username=username to get posts of a specific user otherwise use posts/timeline/all
            const url = username ? `/posts/user-posts?username=${username}` : '/posts/user-posts';
            try {
                // Get timeline posts (populated with user info)
                const timelineRes = await publicRequest().get(url);
                const responseData = timelineRes.data;
                
                // Extract posts array and isOwnProfile from response
                const postsData = responseData.posts || [];
                // Update isOwnProfile state from API response
                setIsOwnProfile(responseData.isOwnProfile);
                
                // Optionally, fetch extra details (e.g., comments) for each post
                const postsWithDetails = await Promise.all(
                    postsData.map(async (post) => {
                        const comRes = await publicRequest().get(`/comments/post/${post._id}`);
                        return {
                            ...post,
                            comments: comRes.data,
                            commentsCount: comRes.data.length
                        };
                    })
                );
                
                setPosts(postsWithDetails);
                if (postsData.length > 0 && postsData[0].userId) {
                    setProfileData(postsData[0].userId);
                } else if (username) {
                    // If no posts but we have a username, try to fetch user profile directly
                    try {
                        const userProfileRes = await publicRequest().get(`/users/profile/${username}`);
                        setProfileData(userProfileRes.data);
                    } catch (profileErr) {
                        console.error('Failed to fetch user profile:', profileErr);
                        // If we can't get user profile either, it might be a non-existent user
                        if (profileErr.response?.status === 404) {
                            throw new Error('user-not-found');
                        }
                        // Check if profile is private
                        if (profileErr.response?.status === 403 && profileErr.response?.data?.isPrivate) {
                            setIsPrivate(true);
                            try {
                                // Try to get basic profile info even if private
                                const basicProfileRes = await publicRequest().get(`/users/basic-profile/${username}`);
                                setProfileData(basicProfileRes.data);
                            } catch (basicErr) {
                                console.error('Failed to fetch basic profile:', basicErr);
                            }
                            throw new Error('profile-private');
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                
                // Check if this is a user not found error
                if (err.response?.status === 404 || err.message === 'user-not-found') {
                    setError('User not found');
                } 
                // Check if this is a private profile
                else if (err.response?.status === 403 && err.response?.data?.isPrivate || err.message === 'profile-private') {
                    setIsPrivate(true);
                } 
                else {
                    setError('Failed to load posts. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPosts();
    }, [username]); // Add username as dependency
    
    // Static hardcoded relationship status
    const relationshipStatus = { status: 'pending' };
    
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
    
    // Handle deleting a post
    const handleDeletePost = async (postId) => {
        if (!postId) return;
        
        try {
            // Make API request to delete post
            await publicRequest().delete(`/posts/${postId}`);
            
            // Remove the post from local state
            setPosts(posts.filter(post => post._id !== postId));
            
            // Close the modal
            setSelectedPost(null);
            
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(err.response?.data?.error || 'Failed to delete post. Please try again.');
        }
    };
    
    // Handler for opening post modal
    const handlePostClick = (post) => {
        setSelectedPost(post);
    };
    
    // Handler for closing post modal
    const handleCloseModal = () => {
        setSelectedPost(null);
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

    // Use profileData if available, otherwise fall back to profileUser
    const displayProfile = profileData || profileUser;

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary py-6 px-4 md:px-8">
            <div className="max-w-2xl mx-auto w-full">
                {error === 'User not found' ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center my-8">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">User not found</h3>
                        <p className="text-text-secondary mb-6">
                            The user you're looking for doesn't exist or might have been removed.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-block bg-primary-color text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                ) : isPrivate ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center my-8">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">Private Profile</h3>
                        <p className="text-text-secondary mb-6">
                            {displayProfile?.username ? 
                                `@${username}'s profile is private. Send a friend request to view their posts.` : 
                                'This profile is private. Only friends can view this content.'}
                        </p>
                        {displayProfile?.username && !isOwnProfile && (
                            <button 
                                onClick={handleFollow}
                                className="inline-block bg-primary-color text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
                            >
                                Send Friend Request
                            </button>
                        )}
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-block ml-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                ) : (
                    <>
                        <ProfileHeader 
                            profileUser={displayProfile}
                            isOwnProfile={isOwnProfile}
                            relationshipStatus={relationshipStatus}
                            postsCount={posts.length}
                            handleFollow={handleFollow}
                            handleUnfollow={handleUnfollow}
                            handleMessage={handleMessage}
                        />
                        
                        <div className="flex justify-center mt-4 mb-8 pt-4 border-t border-divider-color">
                            <div className="flex items-center gap-2 px-1 py-3 mx-4 sm:mx-7 text-sm font-medium text-text-primary border-t-2 border-text-primary uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                                    <path fill="currentColor" d="M5 5h14v14H5z"/>
                                </svg>
                                <span className="text-sm font-medium">Posts</span>
                            </div>
                        </div>
                        
                        {/* Show error if it exists and it's not the user not found error */}
                        {error && error !== 'User not found' && (
                            <div className="text-danger-color text-center mb-6 text-sm bg-[rgba(255,51,51,0.1)] py-3 px-4 rounded-lg animate-shake shadow-sm">{error}</div>
                        )}
                        
                        <div className="space-y-8">
                            {/* New Post Creation Section */}
                            {isOwnProfile && (
                                <CreatePostForm 
                                    profileUser={displayProfile} 
                                    onSubmit={handleCreatePost}
                                />
                            )}
                            
                            {/* Show loading state or posts */}
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8 rounded-xl border border-gray-200 shadow-md bg-white">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-color"></div>
                                    <span className="ml-3 text-text-secondary text-base">Loading posts...</span>
                                </div>
                            ) : (
                                <PostsGrid 
                                    posts={posts} 
                                    profileUser={displayProfile} 
                                    isOwnProfile={isOwnProfile}
                                    onPostClick={handlePostClick}
                                />
                            )}
                        </div>
                        
                        {/* Post Modal */}
                        {selectedPost && (
                            <PostModal 
                                post={selectedPost} 
                                profileUser={displayProfile}
                                onClose={handleCloseModal}
                                onDelete={handleDeletePost}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}