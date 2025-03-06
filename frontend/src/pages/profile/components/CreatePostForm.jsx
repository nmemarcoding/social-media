import React, { useState, useRef } from 'react';

const CreatePostForm = ({ profileUser, onSubmit }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);
    
    // Adjust textarea height automatically
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        
        setIsSubmitting(true);
        
        // Call parent's onSubmit handler with form data
        onSubmit(content, media, () => {
            // Reset form after submission
            setContent('');
            setMedia('');
            setIsSubmitting(false);
            
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        });
    };

    return (
        <div className="createPostSection">
            <div className="createPostHeader">
                <h3>Create New Post</h3>
            </div>
            <form onSubmit={handleSubmit} className="createPostForm">
                <div className="createPostUser">
                    <img 
                        src={profileUser.profilePicture || "https://placehold.co/40"} 
                        alt={profileUser.username} 
                        className="createPostUserImage"
                    />
                    <span className="createPostUsername">{profileUser.username}</span>
                </div>
                <div className="createPostContent">
                    <textarea 
                        ref={textareaRef}
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            adjustTextareaHeight();
                        }}
                        required
                        className="createPostTextarea"
                    />
                    <input 
                        type="text" 
                        placeholder="Image URL (optional)"
                        value={media}
                        onChange={(e) => setMedia(e.target.value)}
                        className="createPostMediaInput"
                    />
                </div>
                <div className="createPostActions">
                    <button 
                        type="submit" 
                        className="createPostButton" 
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;
