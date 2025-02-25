const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        type: String,
        trim: true
    },
    likesCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
postSchema.index({ userId: 1, createdAt: -1 });

// Method to handle likes
postSchema.methods.updateLikesCount = async function(increment = true) {
    const update = increment ? 1 : -1;
    this.likesCount += update;
    return this.save();
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;