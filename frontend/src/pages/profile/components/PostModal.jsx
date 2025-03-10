import React, { useState, useEffect, useRef, useCallback } from 'react';
import { publicRequest } from '../../../hooks/requestMethods';

const PostModal = ({ post, profileUser, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(true);
    
    const modalRef = useRef(null);
    const imageRef = useRef(null);
    const commentsRef = useRef(null);
    
    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };
    
    // Smooth closing animation before actually closing - moved up and memoized
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);
    
    // Handle keyboard events (Esc to close, arrow keys for navigation)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            } else if (e.key === 'ArrowLeft') {
                // Previous image logic would go here
                console.log('Previous image');
            } else if (e.key === 'ArrowRight') {
                // Next image logic would go here
                console.log('Next image');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClose]); // Now handleClose is properly in the dependencies array
    
    // Fetch comments when modal opens
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await publicRequest().get(`/comments/post/${post._id}`);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchComments();
    }, [post._id]);
    
    // Comment submission handler
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        try {
            const response = await publicRequest().post(`/comments/${post._id}`, {
                content: comment
            });
            
            // Add new comment to the list
            setComments([response.data, ...comments]);
            setComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };
    
    // Image zoom functions
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 3));
    };
    
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 1));
    };
    
    const handleZoomReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };
    
    // Image drag functionality
    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };
    
    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    
    // Double click to zoom
    const handleDoubleClick = (e) => {
        if (zoom === 1) {
            setZoom(2);
            
            // Calculate position to zoom to click position
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                setPosition({
                    x: (rect.width / 2) - (x * rect.width),
                    y: (rect.height / 2) - (y * rect.height)
                });
            }
        } else {
            handleZoomReset();
        }
    };
    
    // For mobile: toggle comments visibility
    const toggleComments = () => {
        setIsCommentsVisible(prev => !prev);
    };
    
    // Calculate if this is a post by the current user
    const isOwnPost = profileUser && post.userId === profileUser.id;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            
            {/* Modal Content */}
            <div ref={modalRef} 
                className={`modal-container flex w-[95%] max-w-6xl h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}
                onClick={(e) => e.stopPropagation()}>
                
                {/* Left Section - Image Viewer */}
                <div className="modal-image-section relative flex items-center justify-center bg-black w-full md:w-2/3 h-full overflow-hidden">
                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    {/* Image */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                            ref={imageRef}
                            src={post.media || "https://placehold.co/800?text=No+Image"}
                            alt={`Post by ${profileUser?.username || 'user'}`}
                            className="max-w-full max-h-full object-contain select-none cursor-grab"
                            style={{
                                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onDoubleClick={handleDoubleClick}
                            draggable="false"
                        />
                    </div>
                    
                    {/* Zoom Controls */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3 bg-black bg-opacity-50 text-white rounded-full py-2 px-4">
                        <button onClick={handleZoomOut} className="hover:text-gray-300" disabled={zoom <= 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </button>
                        
                        <span className="text-sm">{Math.round(zoom * 100)}%</span>
                        
                        <button onClick={handleZoomIn} className="hover:text-gray-300" disabled={zoom >= 3}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </button>
                        
                        <button onClick={handleZoomReset} className="hover:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2v6h-6"></path>
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74"></path>
                                <path d="M16 16l5 5"></path>
                            </svg>
                        </button>
                    </div>
                    
                    {/* Toggle Comments Button (Mobile Only) */}
                    <div className="md:hidden absolute bottom-4 right-4">
                        <button 
                            onClick={toggleComments}
                            className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Right Section - Comments & Engagement */}
                <div 
                    ref={commentsRef}
                    className={`modal-content-section flex flex-col bg-white md:w-1/3 h-full md:relative absolute inset-0 transition-transform duration-300 ease-in-out ${
                        isCommentsVisible ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
                    }`}>
                    
                    {/* Mobile Header with Close Button */}
                    <div className="md:hidden flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Comments</h3>
                        <button 
                            onClick={toggleComments}
                            className="p-1 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    {/* Post Header */}
                    <div className="post-header flex items-center p-4 border-b">
                        <img 
                            src={profileUser?.profilePicture || "https://placehold.co/40"}
                            alt={profileUser?.username || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                            <div className="font-semibold text-sm">{profileUser?.username || "User"}</div>
                            <div className="text-xs text-gray-500">{formatDate(post.createdAt)}</div>
                        </div>
                        
                        {/* Options Menu (Three dots) */}
                        {isOwnPost && (
                            <div className="ml-auto">
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="5" r="1"></circle>
                                        <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Post Content */}
                    <div className="post-content p-4 border-b">
                        <p className="text-sm">{post.content}</p>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="engagement-stats flex items-center justify-between p-3 text-xs text-gray-500 border-b">
                        <div className="likes flex items-center">
                            <div className="like-icons flex -space-x-1 mr-2">
                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <span className="text-xs">👍</span>
                                </div>
                            </div>
                            <span>{post.likesCount || 0} likes</span>
                        </div>
                        <div>
                            <span>{comments.length} comments</span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="action-buttons grid grid-cols-3 border-b">
                        <button className="flex items-center justify-center py-2 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            <span className="text-sm">Like</span>
                        </button>
                        
                        <button className="flex items-center justify-center py-2 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span className="text-sm">Comment</span>
                        </button>
                        
                        <button className="flex items-center justify-center py-2 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            <span className="text-sm">Share</span>
                        </button>
                    </div>
                    
                    {/* Comments List */}
                    <div className="comments-list flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="comment mb-4">
                                    <div className="flex">
                                        <img 
                                            src={comment.userId?.profilePicture || "https://placehold.co/40"} 
                                            alt={comment.userId?.username || "User"}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="ml-2 flex-1">
                                            <div className="bg-gray-100 rounded-2xl px-3 py-2">
                                                <div className="font-semibold text-sm">{comment.userId?.username || "User"}</div>
                                                <div className="text-sm">{comment.content}</div>
                                            </div>
                                            <div className="flex items-center mt-1 ml-1 text-xs text-gray-500">
                                                <button className="mr-3 hover:underline">Like</button>
                                                <button className="hover:underline">Reply</button>
                                                <span className="ml-3">{formatDate(comment.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-6">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                    
                    {/* New Comment Input */}
                    <div className="new-comment-section border-t p-3">
                        <form onSubmit={handleCommentSubmit} className="flex items-center">
                            <img 
                                src={profileUser?.profilePicture || "https://placehold.co/40"}
                                alt={profileUser?.username || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="relative flex-1 ml-2">
                                <input 
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full rounded-full bg-gray-100 py-2 px-4 pr-12 text-sm focus:outline-none"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="text-gray-500 hover:text-gray-700">
                                        <span role="img" aria-label="emoji" className="text-lg">😊</span>
                                    </button>
                                </div>
                                
                                {/* Emoji Picker (simplified) */}
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-white shadow-lg rounded-lg p-2 w-64 h-36 overflow-y-auto">
                                        <div className="grid grid-cols-8 gap-1">
                                            {["😀", "😂", "❤️", "👍", "🎉", "🔥", "👏", "😍",
                                              "🤔", "😎", "😢", "😡", "🥳", "🤩", "🙏", "😊"].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        setComment(prev => prev + emoji);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="hover:bg-gray-100 p-1 rounded text-xl"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button 
                                type="submit" 
                                disabled={!comment.trim()}
                                className={`ml-2 text-primary-color ${!comment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
