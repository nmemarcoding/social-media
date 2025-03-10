import React from 'react';

const ProfileHeader = ({ 
    profileUser, 
    isOwnProfile, 
    relationshipStatus, 
    postsCount, 
    handleFollow, 
    handleUnfollow, 
    handleMessage 
}) => {
    return (
        <div className="profileHeader flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b border-divider-color">
            {/* Profile Picture with Enhancement */}
            <div className="flex justify-center md:justify-start">
                {profileUser.profilePicture ? (
                    <img 
                        src={profileUser.profilePicture} 
                        alt={`${profileUser.username}'s profile`} 
                        className="w-36 h-36 rounded-full object-cover border border-divider-color shrink-0 ring-2 ring-gray-300 shadow-md" 
                    />
                ) : (
                    <div className="w-36 h-36 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-medium shrink-0 ring-2 ring-gray-300 shadow-md">
                        {profileUser.firstName?.charAt(0) || ''}{profileUser.lastName?.charAt(0) || ''}
                    </div>
                )}
            </div>
            
            <div className="profileInfo flex flex-col flex-1">
                <div className="profileUsername text-xl font-semibold text-gray-800 mb-3 flex items-center justify-center md:justify-start">
                    {profileUser.username}
                </div>
                
                <div className="profileActionButtons flex gap-2 mt-2 mb-4 justify-center md:justify-start">
                    {isOwnProfile ? (
                        <button className="editProfileBtn px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-sm">
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            {relationshipStatus && relationshipStatus.status === 'accepted' ? (
                                <button 
                                    className="unfollowBtn px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm" 
                                    onClick={handleUnfollow}>
                                    Unfollow
                                </button>
                            ) : relationshipStatus && relationshipStatus.status === 'pending' ? (
                                <button 
                                    className="unfollowBtn px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm" 
                                    onClick={handleUnfollow}>
                                    Requested
                                </button>
                            ) : (
                                <button 
                                    className="followBtn px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg font-medium text-sm transition-all duration-200 shadow-sm" 
                                    onClick={handleFollow}>
                                    Follow
                                </button>
                            )}
                            <button 
                                className="messageBtn px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm" 
                                onClick={handleMessage}>
                                Message
                            </button>
                        </>
                    )}
                </div>
                
                <div className="profileStats flex mb-4 gap-10 text-gray-600 text-sm justify-center md:justify-start">
                    <div className="profileStat flex gap-1.5">
                        <span className="profileStatNumber font-semibold">{postsCount}</span> posts
                    </div>
                    <div className="profileStat flex gap-1.5">
                        <span className="profileStatNumber font-semibold">{profileUser.friendsCount || 0}</span> followers
                    </div>
                </div>
                
                <div className="text-center md:text-left">
                    <div className="profileName font-semibold text-sm mb-2">
                        {profileUser.firstName} {profileUser.lastName}
                    </div>
                    
                    <div className="profileBio text-sm whitespace-pre-wrap break-words text-gray-700">
                        {profileUser.bio || "No bio yet."}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
