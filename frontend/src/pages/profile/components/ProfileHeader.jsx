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
        <div className="profileHeader">
            <img 
                src={profileUser.profilePicture || "https://placehold.co/150"} 
                alt={`${profileUser.username}'s profile`} 
                className="profilePicture" 
            />
            
            <div className="profileInfo">
                <div className="profileUsername">
                    {profileUser.username}
                </div>
                
                <div className="profileActionButtons">
                    {isOwnProfile ? (
                        <button className="editProfileBtn">Edit Profile</button>
                    ) : (
                        <>
                            {relationshipStatus && relationshipStatus.status === 'accepted' ? (
                                <button className="unfollowBtn" onClick={handleUnfollow}>Unfollow</button>
                            ) : relationshipStatus && relationshipStatus.status === 'pending' ? (
                                <button className="unfollowBtn" onClick={handleUnfollow}>Requested</button>
                            ) : (
                                <button className="followBtn" onClick={handleFollow}>Follow</button>
                            )}
                            <button className="messageBtn" onClick={handleMessage}>Message</button>
                        </>
                    )}
                </div>
                
                <div className="profileStats">
                    <div className="profileStat">
                        <span className="profileStatNumber">{postsCount}</span> posts
                    </div>
                    <div className="profileStat">
                        <span className="profileStatNumber">{profileUser.friendsCount || 0}</span> followers
                    </div>
                </div>
                
                <div className="profileName">
                    {profileUser.firstName} {profileUser.lastName}
                </div>
                
                <div className="profileBio">
                    {profileUser.bio || "No bio yet."}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
