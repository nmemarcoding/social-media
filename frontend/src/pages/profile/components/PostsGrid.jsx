import React from 'react';
import PostItem from './PostItem';

const PostsGrid = ({ posts, profileUser, isOwnProfile, onPostClick }) => {
    return (
        <div className="postsGrid">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostItem 
                        key={post._id}
                        post={post}
                        profileUsername={profileUser.username}
                        onClick={() => onPostClick(post)}
                    />
                ))
            ) : (
                <div className="noPostsMessage">
                    {isOwnProfile 
                        ? "Share your first post!" 
                        : `${profileUser.username} hasn't posted anything yet.`}
                </div>
            )}
        </div>
    );
};

export default PostsGrid;
