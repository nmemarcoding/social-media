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
                <div className="flex flex-col items-center justify-center text-center text-gray-500 text-lg py-16">
                    <svg className="w-12 h-12 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isOwnProfile 
                        ? "Share your first post!" 
                        : `${profileUser.username} hasn't posted anything yet.`}
                </div>
            )}
        </div>
    );
};

export default PostsGrid;
