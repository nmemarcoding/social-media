import React from 'react';
import PostItem from './PostItem';

const PostsGrid = ({ posts, profileUser, isOwnProfile }) => {
    return (
        <div className="postsGrid">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostItem 
                        key={post._id}
                        post={post}
                        profileUsername={profileUser.username}
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
