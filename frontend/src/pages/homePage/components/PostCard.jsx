import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../../hooks/requestMethods';

const PostCard = ({ post, currentUser, onLikePost }) => {
    const user = post.userId || {};

    const [comment, setComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isPostingComment, setIsPostingComment] = useState(false);

    // Format timestamp
    const formatDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Today, show hours
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                // Less than an hour, show minutes
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            }
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Check if post is liked by current user
    const isLiked = post.likes && post.likes.includes(currentUser.id);

    // Toggle comments section
    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            // Fetch comments
            setIsLoadingComments(true);
            try {
                const response = await publicRequest().get(`/comments/post/${post._id}`);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setIsLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        setIsPostingComment(true);
        try {
            const response = await publicRequest().post(`/comments/${post._id}`, {
                content: comment
            });
            
            setComments([response.data, ...comments]);
            setComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsPostingComment(false);
        }
    };

    // Use a local fallback image instead of via.placeholder.com
    const fallbackUserImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E2E8F0'/%3E%3Cpath d='M20 20C17.7909 20 16 18.2091 16 16C16 13.7909 17.7909 12 20 12C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20ZM12 28C12 24.6863 15.5817 22 20 22C24.4183 22 28 24.6863 28 28H12Z' fill='%23CBD5E0'/%3E%3C/svg%3E";

    const fallbackPostImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23E2E8F0'/%3E%3Cpath d='M285 160H315C323.284 160 330 166.716 330 175V225C330 233.284 323.284 240 315 240H285C276.716 240 270 233.284 270 225V175C270 166.716 276.716 160 285 160Z' fill='%23CBD5E0'/%3E%3Ccircle cx='300' cy='187' r='10' fill='%23CBD5E0'/%3E%3Cpath d='M270 205.226V225C270 233.284 276.716 240 285 240H315C323.284 240 330 233.284 330 225V205.226C330 205.226 317.875 190 300 190C282.125 190 270 205.226 270 205.226Z' fill='%23A0AEC0'/%3E%3Ctext x='300' y='280' font-family='Arial' font-size='24' text-anchor='middle' fill='%234A5568'%3EImage Not Available%3C/text%3E%3C/svg%3E";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Post Header */}
            <div className="px-4 pt-4 flex items-center">
                <Link to={`/profile/${user.username}`} className="flex-shrink-0">
                    <img 
                        src={user.profilePicture || fallbackUserImage} 
                        alt={`${user.username || 'User'}`} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                        onError={(e) => { e.target.src = fallbackUserImage }}
                    />
                </Link>
                <div className="ml-3 flex-1">
                    <Link to={`/profile/${user.username}`} className="font-semibold text-text-primary hover:underline">
                        {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'User'}
                    </Link>
                    <div className="text-xs text-text-secondary">
                        {formatDate(post.createdAt)}
                    </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>
            
            {/* Post Content */}
            <div className="px-4 py-3">
                <p className="text-sm mb-3 whitespace-pre-line">{post.content}</p>
                
                {/* Post Image (if exists) */}
                {post.media && (
                    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                            src={post.media} 
                            alt="Post content" 
                            className="w-full h-auto object-cover max-h-[500px]"
                            onError={(e) => {e.target.src = fallbackPostImage}}
                        />
                    </div>
                )}
            </div>
            
            {/* Post Stats */}
            <div className="px-4 py-2 flex justify-between text-xs text-text-secondary border-t border-b border-gray-100">
                <div className="flex items-center">
                    {(post.likesCount > 0 || isLiked) && (
                        <>
                            <div className="bg-primary-color rounded-full w-5 h-5 flex items-center justify-center mr-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </div>
                            <span>{post.likesCount || 0}</span>
                        </>
                    )}
                </div>
                {post.commentsCount > 0 && (
                    <button onClick={toggleComments} className="hover:underline">
                        {post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}
                    </button>
                )}
            </div>
            
            {/* Post Actions */}
            <div className="flex border-b border-gray-100">
                <button 
                    className={`flex items-center justify-center py-2 flex-1 transition-colors ${
                        isLiked ? 'text-primary-color font-medium' : 'text-text-secondary hover:bg-gray-50'
                    }`}
                    onClick={() => onLikePost(post._id)}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill={isLiked ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke={isLiked ? "none" : "currentColor"} 
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">Like</span>
                </button>
                
                <button 
                    className={`flex items-center justify-center py-2 flex-1 transition-colors ${
                        isCommenting ? 'text-primary-color font-medium' : 'text-text-secondary hover:bg-gray-50'
                    }`}
                    onClick={() => {
                        setIsCommenting(!isCommenting);
                        if (!isCommenting) toggleComments();
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">Comment</span>
                </button>
                
                <button className="flex items-center justify-center py-2 flex-1 text-text-secondary hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm">Share</span>
                </button>
            </div>
            
            {/* Comment Section */}
            {(isCommenting || showComments) && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="flex mb-4">
                        <img 
                            src={currentUser.profilePicture || fallbackUserImage} 
                            alt={currentUser.username} 
                            className="w-8 h-8 rounded-full object-cover mr-2"
                            onError={(e) => {e.target.src = fallbackUserImage}}
                        />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="bg-white border border-gray-200 rounded-full py-2 px-4 w-full text-sm focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                            />
                            <button 
                                type="submit"
                                disabled={!comment.trim() || isPostingComment}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-color disabled:text-gray-300"
                            >
                                {isPostingComment ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                
                    {/* Comments List */}
                    <div className="space-y-3">
                        {isLoadingComments ? (
                            <div className="flex justify-center py-4">
                                <svg className="animate-spin h-5 w-5 text-primary-color" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment._id} className="flex">
                                    <img 
                                        src={(comment.userId?.profilePicture) || fallbackUserImage} 
                                        alt={comment.userId?.username || "User"} 
                                        className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                                        onError={(e) => {e.target.src = fallbackUserImage}}
                                    />
                                    <div>
                                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                            <Link to={`/profile/${comment.userId?.username}`} className="font-medium text-xs text-text-primary hover:underline">
                                                {comment.userId?.username || "User"}
                                            </Link>
                                            <p className="text-sm text-text-primary">{comment.content}</p>
                                        </div>
                                        <div className="mt-1 ml-1 flex items-center text-xs text-text-secondary">
                                            <button className="hover:underline mr-2">Like</button>
                                            <button className="hover:underline mr-2">Reply</button>
                                            <span>{formatDate(comment.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-text-secondary py-2">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
