const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Create post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({
            userId: req.user.id,
            content: req.body.content,
            media: req.body.media
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "You can only update your own posts",
             });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    content: req.body.content,
                    media: req.body.media
                }
            },
            { new: true }
        );

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
       
        if (post.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "You can only delete your own posts", });
        }
        

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get a post
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the post belongs to the authenticated user
        if (post.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "You can only view your own posts" });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get timeline posts
router.get('/timeline/all', auth, async (req, res) => {
    try {
        // Only fetch posts from the authenticated user
        const userPosts = await Post.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW ROUTE: Get comments for a post
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

// NEW ROUTE: Create comment for a post
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
            userId: req.user.id,
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

module.exports = router;