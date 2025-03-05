const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // This automatically adds createdAt and updatedAt fields
});

// Indexes for better query performance
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// Virtual populate to get sender info
messageSchema.virtual('sender', {
    ref: 'User',
    localField: 'senderId',
    foreignField: '_id',
    justOne: true
});

// Virtual populate to get receiver info
messageSchema.virtual('receiver', {
    ref: 'User',
    localField: 'receiverId',
    foreignField: '_id',
    justOne: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
