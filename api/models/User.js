const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true,
        default: '' 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true,
        default: '' 
    },
    passwordHash: { 
        type: String, 
        required: true,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: 'https://placehold.co/150'
    },
    coverPhoto: {
        type: String,
        default: 'https://placehold.co/1080x360'
    },
    isPrivate: { 
        type: Boolean, 
        default: false 
    },
    friendsCount: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Add lastLogin field
userSchema.add({
    lastLogin: {
        type: Date,
        default: null
    }
});

// Method to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;