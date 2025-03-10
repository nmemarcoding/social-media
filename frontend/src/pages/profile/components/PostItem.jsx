import React from 'react';

const PostItem = ({ post, profileUsername, onClick }) => {
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

    return (
        <div className="postItem relative aspect-square overflow-hidden cursor-pointer rounded-lg shadow-sm transition-all duration-200 hover:shadow-md" onClick={onClick}>
            <img 
                src={post.media || "https://placehold.co/400?text=No+Image"} 
                alt={`Post by ${profileUsername}`}
                className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            <div className="postOverlay absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.4)] flex flex-col justify-between p-4 opacity-0 transition-opacity hover:opacity-100">
                <div className="text-xs text-white bg-black bg-opacity-50 self-start py-1 px-2 rounded">
                    {post.createdAt ? formatDate(post.createdAt) : 'Recently'}
                </div>
                <div className="postStats flex gap-7 text-white font-semibold">
                    <div className="postStat flex items-center gap-1.5">
                        ❤️ {post.likesCount || 0}
                    </div>
                    <div className="postStat flex items-center gap-1.5">
                        💬 0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
