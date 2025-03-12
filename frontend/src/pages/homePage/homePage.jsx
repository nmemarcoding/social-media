import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest, getUserInfo } from '../../hooks/requestMethods';

// Reuse components from profile page
import CreatePostForm from '../profile/components/CreatePostForm';
import PostCard from './components/PostCard';
import StoriesSection from './components/StoriesSection';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get current user info
    const currentUser = getUserInfo() || {};

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
    
    // Handle creating a new post
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

    // Handle liking a post
    const handleLikePost = async (postId) => {
        try {
            await publicRequest().put(`/posts/${postId}/like`);
            
            // Update the post in our local state
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        likes: post.likes ? [...post.likes, currentUser.id] : [currentUser.id],
                        likesCount: (post.likesCount || 0) + 1
                    };
                }
                return post;
            }));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    return (
        <div className="min-h-screen bg-bg-secondary">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Stories Section */}
                <div className="mb-4">
                    <StoriesSection />
                </div>
                
                {/* Post Creation Area */}
                <div className="mb-4">
                    <CreatePostForm 
                        profileUser={currentUser} 
                        onSubmit={handleCreatePost} 
                    />
                </div>
                
                {/* Display error if exists */}
                {error && (
                    <div className="text-danger-color text-center mb-4 text-sm bg-[rgba(255,51,51,0.1)] py-3 px-4 rounded-lg animate-shake shadow-sm">
                        {error}
                    </div>
                )}
                
                {/* Posts Feed */}
                <div className="space-y-4">
                    {isLoading ? (
                        // Loading skeleton
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                            <div className="h-3 bg-gray-100 rounded w-1/5"></div>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                                    <div className="h-40 bg-gray-100 rounded mb-4 w-full"></div>
                                    <div className="flex justify-around border-t border-gray-100 pt-2">
                                        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
                                        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
                                        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                                currentUser={currentUser} 
                                onLikePost={handleLikePost} 
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-2 text-text-primary">No posts yet</h3>
                            <p className="text-text-secondary mb-6">
                                When you or your friends create posts, they'll appear here.
                            </p>
                            <Link 
                                to="/find-friends" 
                                className="inline-block bg-primary-color text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
                            >
                                Find Friends
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
