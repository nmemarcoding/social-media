const router = require('express').Router();
const Relationship = require('../models/Relationship');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
    try {
        const recipientId = req.params.userId;
        
        // Check if trying to friend self
        if (req.user.id === recipientId) {
            return res.status(400).json({ error: "Cannot send friend request to yourself" });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if relationship already exists
        const existingRelationship = await Relationship.findRelationship(req.user.id, recipientId);
        if (existingRelationship) {
            return res.status(400).json({ error: "Relationship already exists" });
        }

        const newRelationship = new Relationship({
            requester: req.user.id,
            recipient: recipientId,
            status: 'pending'
        });

        const savedRelationship = await newRelationship.save();
        res.status(201).json(savedRelationship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept friend request
router.put('/accept/:userId', auth, async (req, res) => {
    try {
        const relationship = await Relationship.findOne({
            recipient: req.user.id,
            requester: req.params.userId,
            status: 'pending'
        });
       


        if (!relationship) {
            return res.status(404).json({ error: "Friend request not found" });
        }

        relationship.status = 'accepted';
        const updatedRelationship = await relationship.save();

        // Update friends count for both users
        await User.findByIdAndUpdate(req.user.id, { $inc: { friendsCount: 1 } });
        await User.findByIdAndUpdate(req.params.userId, { $inc: { friendsCount: 1 } });

        res.json(updatedRelationship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove friend (unfriend)
router.delete('/friend/:userId', auth, async (req, res) => {
    try {
        const relationship = await Relationship.findOneAndDelete({
            $or: [
                { requester: req.user.id, recipient: req.params.userId },
                { requester: req.params.userId, recipient: req.user.id }
            ],
            status: 'accepted'
        });

        if (!relationship) {
            return res.status(404).json({ error: "Friendship not found" });
        }

        // Update friends count for both users (decrement)
        await User.findByIdAndUpdate(req.user.id, { $inc: { friendsCount: -1 } });
        await User.findByIdAndUpdate(req.params.userId, { $inc: { friendsCount: -1 } });

        res.json({ message: "Friend removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject/Cancel friend request
router.delete('/request/:userId', auth, async (req, res) => {
    try {
        const relationship = await Relationship.findOneAndDelete({
            $or: [
                { requester: req.user.id, recipient: req.params.userId },
                { requester: req.params.userId, recipient: req.user.id }
            ],
            status: 'pending'
        });

        if (!relationship) {
            return res.status(404).json({ error: "Friend request not found" });
        }

        res.json({ message: "Friend request cancelled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Block user
router.post('/block/:userId', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        
        // Remove any existing relationship
        await Relationship.findOneAndDelete({
            $or: [
                { requester: req.user.id, recipient: targetUserId },
                { requester: targetUserId, recipient: req.user.id }
            ]
        });

        // Create blocked relationship
        const blockedRelationship = new Relationship({
            requester: req.user.id,
            recipient: targetUserId,
            status: 'blocked'
        });

        const savedRelationship = await blockedRelationship.save();
        res.status(201).json(savedRelationship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all friends
router.get('/friends', auth, async (req, res) => {
    try {
        const relationships = await Relationship.find({
            $or: [
                { requester: req.user.id },
                { recipient: req.user.id }
            ],
            status: 'accepted'
        }).populate('requester recipient', 'username firstName lastName profilePicture');

        res.json(relationships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users with relationship status
router.get('/users', auth, async (req, res) => {
    try {
        // Get query parameter for search
        const search = req.query.search || '';
        
        // Build search query
        const searchQuery = search ? {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ]
        } : {};
        
        // Exclude current user
        const excludeUsers = { _id: { $ne: req.user.id } };
        
        // Combine search and exclude filters
        const query = { ...searchQuery, ...excludeUsers };
        
        // Get all users
        const users = await User.find(query)
            .select('username firstName lastName profilePicture bio friendsCount');
        
        // Get all relationships for current user
        const relationships = await Relationship.find({
            $or: [
                { requester: req.user.id },
                { recipient: req.user.id }
            ]
        });
        
        // Create a map of userId to relationship
        const relationshipMap = {};
        relationships.forEach(rel => {
            const otherUserId = rel.requester.toString() === req.user.id.toString() 
                ? rel.recipient.toString() 
                : rel.requester.toString();
            
            let relationshipStatus = rel.status;
            
            // Add direction for pending relationships
            if (relationshipStatus === 'pending') {
                relationshipStatus = rel.requester.toString() === req.user.id.toString()
                    ? 'pending_sent'
                    : 'pending_received';
            }
            
            relationshipMap[otherUserId] = relationshipStatus;
        });
        
        // Add relationship status to each user
        const usersWithRelationship = users.map(user => {
            const userObj = user.toObject();
            userObj.relationshipStatus = relationshipMap[user._id.toString()] || null;
            return userObj;
        });
        
        res.json({ users: usersWithRelationship });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get pending friend requests
router.get('/pending', auth, async (req, res) => {
    try {
        const pendingRequests = await Relationship.find({
            recipient: req.user.id,
            status: 'pending'
        }).populate('requester', 'username firstName lastName profilePicture');
        
        res.json(pendingRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;