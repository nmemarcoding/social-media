const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Send a message
router.post('/:receiverId', auth, async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        
        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Recipient not found" });
        }

        // Prevent sending message to self
        if (req.user.id === receiverId) {
            return res.status(400).json({ error: "Cannot send message to yourself" });
        }

        const newMessage = new Message({
            senderId: req.user.id,
            receiverId: receiverId,
            content: req.body.content
        });

        const savedMessage = await newMessage.save();
        await savedMessage.populate('sender', 'username firstName lastName');
        
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get conversation between two users
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user.id, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user.id }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'username firstName lastName')
        .populate('receiver', 'username firstName lastName');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        // Get all messages where user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'username firstName lastName')
        .populate('receiver', 'username firstName lastName');

        // Group messages by conversation partner
        const conversations = messages.reduce((acc, message) => {
            const partnerId = message.senderId.equals(req.user.id) 
                ? message.receiverId 
                : message.senderId;
            
            const partnerIdString = partnerId.toString();
            
            if (!acc[partnerIdString]) {
                acc[partnerIdString] = {
                    partner: message.senderId.equals(req.user.id) 
                        ? message.receiver 
                        : message.sender,
                    lastMessage: message,
                    unreadCount: message.senderId.equals(partnerId) && !message.seen ? 1 : 0
                };
            } else if (!message.seen && message.senderId.equals(partnerId)) {
                acc[partnerIdString].unreadCount += 1;
            }
            
            return acc;
        }, {});

        res.json(Object.values(conversations));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark messages as seen
router.put('/seen/:senderId', auth, async (req, res) => {
    try {
        await Message.updateMany(
            {
                senderId: req.params.senderId,
                receiverId: req.user.id,
                seen: false
            },
            {
                $set: { seen: true }
            }
        );

        res.json({ message: "Messages marked as seen" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a message (only sender can delete)
router.delete('/:messageId', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "You can only delete messages you sent" });
        }

        await message.deleteOne();
        res.json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
