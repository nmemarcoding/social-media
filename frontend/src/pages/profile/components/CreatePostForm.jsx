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
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-5">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Create New Post</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    {profileUser.profilePicture ? (
                        <img 
                            src={profileUser.profilePicture} 
                            alt={profileUser.username} 
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-300"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                            {profileUser.firstName?.charAt(0) || ''}
                        </div>
                    )}
                    <span className="font-semibold text-gray-700">{profileUser.username}</span>
                </div>
                <div className="flex flex-col gap-4">
                    <textarea 
                        ref={textareaRef}
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            adjustTextareaHeight();
                        }}
                        required
                        className="min-h-20 p-4 rounded-lg border border-gray-300 focus:border-blue-400 text-base resize-none overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                    />
                    <input 
                        type="text" 
                        placeholder="Image URL (optional)"
                        value={media}
                        onChange={(e) => setMedia(e.target.value)}
                        className="p-4 rounded-lg border border-gray-300 focus:border-blue-400 text-base transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        className={`px-6 py-2 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 ${
                            isSubmitting || !content.trim() 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 shadow-sm'
                        }`}
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
