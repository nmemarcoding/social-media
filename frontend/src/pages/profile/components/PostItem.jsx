import React from 'react';

const PostItem = ({ post, profileUsername }) => {
    return (
        <div key={post._id} className="postItem">
            <img 
                src={post.media || "https://placehold.co/400?text=No+Image"} 
                alt={`Post by ${profileUsername}`}
            />
            <div className="postOverlay">
                <div className="postStats">
                    <div className="postStat">
                        ❤️ {post.likesCount || 0}
                    </div>
                    <div className="postStat">
                        💬 0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
