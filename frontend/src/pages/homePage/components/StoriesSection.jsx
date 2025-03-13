import React from 'react';
import { getUserInfo } from '../../../hooks/requestMethods';

const StoriesSection = () => {
    // Get current user
    const currentUser = getUserInfo() || {};
    
    // Fallback image as data URL
    const fallbackUserImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23E2E8F0'/%3E%3Cpath d='M32 32C28.4651 32 25.6 29.1349 25.6 25.6C25.6 22.0651 28.4651 19.2 32 19.2C35.5349 19.2 38.4 22.0651 38.4 25.6C38.4 29.1349 35.5349 32 32 32ZM19.2 44.8C19.2 39.498 24.9307 35.2 32 35.2C39.0693 35.2 44.8 39.498 44.8 44.8H19.2Z' fill='%23CBD5E0'/%3E%3C/svg%3E";
    
    // Sample stories data - in a real app this would come from an API
    const stories = [
        {
            id: 'create',
            username: currentUser.username,
            profilePicture: currentUser.profilePicture,
            isCreateStory: true,
        },
        {
            id: 's1',
            username: 'user1',
            profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
            viewed: false,
        },
        {
            id: 's2',
            username: 'user2',
            profilePicture: 'https://randomuser.me/api/portraits/men/33.jpg',
            viewed: false,
        },
        {
            id: 's3',
            username: 'user3',
            profilePicture: 'https://randomuser.me/api/portraits/women/63.jpg',
            viewed: true,
        },
        {
            id: 's4',
            username: 'user4',
            profilePicture: 'https://randomuser.me/api/portraits/men/51.jpg',
            viewed: true,
        },
        {
            id: 's5',
            username: 'user5',
            profilePicture: 'https://randomuser.me/api/portraits/women/21.jpg',
            viewed: false,
        },
    ];
    
    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="overflow-x-auto">
                <div className="flex space-x-4 min-w-max pb-2">
                    {stories.map(story => (
                        <div key={story.id} className="flex flex-col items-center">
                            {story.isCreateStory ? (
                                // Create Story
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-gray-100">
                                        <img 
                                            src={story.profilePicture || fallbackUserImage}
                                            alt={story.username || "User"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {e.target.src = fallbackUserImage}}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-color rounded-full border-4 border-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                // Story Item
                                <div className={`w-16 h-16 rounded-full p-[2px] ${
                                    story.viewed ? 'bg-gray-300' : 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
                                }`}>
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                                        <img 
                                            src={story.profilePicture} 
                                            alt={story.username}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {e.target.src = fallbackUserImage}}
                                        />
                                    </div>
                                </div>
                            )}
                            <span className={`mt-1 text-xs ${story.isCreateStory ? 'text-text-primary' : 'text-text-secondary'} truncate w-16 text-center`}>
                                {story.isCreateStory ? 'Create Story' : story.username}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoriesSection;
