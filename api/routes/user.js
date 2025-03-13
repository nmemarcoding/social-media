const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Relationship = require('../models/Relationship');
const auth = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            username,
            email: email.toLowerCase(),
            passwordHash: password, // Will be hashed by pre-save hook
            firstName,
            lastName
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set token in header
        res.header('x-auth-token', token);
        
        res.status(201).json({
            
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                coverPhoto: user.coverPhoto,
                bio: user.bio
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;        
           

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set token in header
        res.header('x-auth-token', token);

        res.json({
          
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                coverPhoto: user.coverPhoto,
                bio: user.bio
                
         
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user by username
router.get('/profile/:username', auth, async (req, res) => {
    try {
        const username = req.params.username;

        // Find user by username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the requester is the same as the requested user
        const isSameUser = req.user.id === user._id.toString();
        
        // If not the same user and the profile is private, check friendship status
        if (!isSameUser && user.isPrivate) {
            // Check if users are friends
            const relationship = await Relationship.findOne({
                $or: [
                    { requester: req.user.id, recipient: user._id, status: 'accepted' },
                    { requester: user._id, recipient: req.user.id, status: 'accepted' }
                ]
            });
            
            // If not friends and profile is private, return privacy message
            if (!relationship) {
                return res.status(403).json({ 
                    message: 'This profile is private',
                    isPrivate: true
                });
            }
        }

        // Return user information
        res.json({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            profilePicture: user.profilePicture,
            coverPhoto: user.coverPhoto,
            friendsCount: user.friendsCount
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;