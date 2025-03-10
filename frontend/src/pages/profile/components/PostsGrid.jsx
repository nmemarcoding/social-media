import React from 'react';
import PostItem from './PostItem';

const PostsGrid = ({ posts, profileUser, isOwnProfile, onPostClick }) => {
    return (
        <div className="rounded-xl border border-gray-200 p-4 shadow-md bg-white">
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {posts.map((post) => (
                        <PostItem 
                            key={post._id}
                            post={post}
                            profileUsername={profileUser.username}
                            onClick={() => onPostClick(post)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center text-center text-gray-500 text-lg py-16">
                    {isOwnProfile 
                        ? "Share your first post!" 
                        : `${profileUser.username} hasn't posted anything yet.`}
                </div>
            )}
        </div>
    );
};

export default PostsGrid;
