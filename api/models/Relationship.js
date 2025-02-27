const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'pending'
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Create compound index for faster lookups
relationshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Add static method to find relationship between two users
relationshipSchema.statics.findRelationship = function(user1Id, user2Id) {
    return this.findOne({
        $or: [
            { requester: user1Id, recipient: user2Id },
            { requester: user2Id, recipient: user1Id }
        ]
    });
};

const Relationship = mongoose.model('Relationship', relationshipSchema);

module.exports = Relationship;