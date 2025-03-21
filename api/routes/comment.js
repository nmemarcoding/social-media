const router = require('express').Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Create a comment
router.post('/:postId', auth, async (req, res) => {
    try {
        // Check if post exists
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Create new comment
        const newComment = new Comment({
            postId: req.params.postId,
            userId: req.user.id, // From auth middleware
            content: req.body.content
        });

        const savedComment = await newComment.save();
        
        // Populate user info
        await savedComment.populate('userId', 'username');
        
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get comments for a post
router.get('/post/:postId', auth, async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username');
        
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a comment
router.put('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Check if user owns the comment
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You can only update your own comments" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                $set: { content: req.body.content }
            },
            { new: true }
        ).populate('userId', 'username');

        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Check if user owns the comment
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;