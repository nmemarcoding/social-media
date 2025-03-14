const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Relationship = require('../models/Relationship');
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
        
        // Delete all comments associated with this post
        await Comment.deleteMany({ postId: req.params.id });
        
        // Delete the post
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
        // Find all accepted relationships involving the current user
        const relationships = await Relationship.find({
            status: 'accepted',
            $or: [
                { requester: req.user.id },
                { recipient: req.user.id }
            ]
        });

        // Extract friend IDs based on the relationship schema
        const friendIds = relationships.map(rel =>
            rel.requester.toString() === req.user.id ? rel.recipient : rel.requester
        );

        // Combine current user's ID with friend IDs
        const userAndFriendIds = [req.user.id, ...friendIds];

        // Fetch posts from the user and their friends
        const timelinePosts = await Post.find({ userId: { $in: userAndFriendIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture');


        res.json(timelinePosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all posts for authenticated user
router.get('/user/posts', auth, async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture');
        
        res.json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;