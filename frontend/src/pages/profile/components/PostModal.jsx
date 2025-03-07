import React, { useState, useEffect } from 'react';
import { publicRequest } from '../../../hooks/requestMethods';

// Custom function to format date relative to now
const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
};

const PostModal = ({ post, profileUser, onClose }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Fetch comments when modal opens - UPDATED ROUTE
    useEffect(() => {
        const fetchComments = async () => {
            if (!post || !post._id) return;
            
            setIsLoading(true);
            try {
                // Updated to use post route instead of comments route
                const res = await publicRequest().get(`/posts/post/${post._id}`);
                setComments(res.data);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchComments();
    }, [post]);

    // Handle adding a new comment - UPDATED ROUTE
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !post._id) return;

        try {
            // Updated to use post route instead of comments route
            const res = await publicRequest().post(`/posts/${post._id}`, {
                content: commentText
            });
            
            setComments([res.data, ...comments]);
            setCommentText('');
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    // Handle click outside to close modal
    const handleOutsideClick = (e) => {
        if (e.target.className === 'postModalOverlay') {
            onClose();
        }
    };

    if (!post) return null;

    return (
        <div className="postModalOverlay" onClick={handleOutsideClick}>
            <div className="postModal">
                <button className="postModalCloseButton" onClick={onClose}>×</button>
                
                <div className="postModalContent">
                    <div className="postModalImageContainer">
                        <img 
                            src={post.media || "https://placehold.co/600?text=No+Image"} 
                            alt={`Post by ${profileUser.username}`}
                            className="postModalImage" 
                        />
                    </div>
                    
                    <div className="postModalDetails">
                        <div className="postModalHeader">
                            <img 
                                src={profileUser.profilePicture || "https://placehold.co/40"} 
                                alt={profileUser.username} 
                                className="postModalUserImage" 
                            />
                            <div className="postModalUsername">{profileUser.username}</div>
                        </div>
                        
                        <div className="postModalText">{post.content}</div>
                        
                        <div className="postModalComments">
                            {isLoading ? (
                                <div className="postModalCommentsLoading">Loading comments...</div>
                            ) : (
                                <>
                                    <div className="postModalCommentsHeader">
                                        Comments ({comments.length})
                                    </div>
                                    
                                    <div className="postModalCommentsList">
                                        {comments.length === 0 ? (
                                            <div className="postModalNoComments">No comments yet</div>
                                        ) : (
                                            comments.map(comment => (
                                                <div key={comment._id} className="postModalComment">
                                                    <div className="postModalCommentUser">
                                                        {comment.userId && comment.userId.username ? comment.userId.username : 'Unknown user'}:
                                                    </div>
                                                    <div className="postModalCommentContent">
                                                        {comment.content}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                            
                            <form onSubmit={handleAddComment} className="postModalCommentForm">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="postModalCommentInput"
                                />
                                <button 
                                    type="submit" 
                                    className="postModalCommentButton"
                                    disabled={!commentText.trim()}
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                        
                        <div className="postModalStats">
                            <div className="postModalLikes">❤️ {post.likesCount || 0} likes</div>
                            <div className="postModalDate">
                                {post.createdAt ? 
                                    formatRelativeTime(post.createdAt) : 
                                    'Recently'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
