import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema({
    fromPath: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    toPath: {
        type: String,
        required: true,
        trim: true
    },
    redirectType: {
        type: Number,
        enum: [301, 302],
        default: 301,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
redirectSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Validate paths
redirectSchema.pre('save', function (next) {
    // Ensure fromPath starts with /
    if (!this.fromPath.startsWith('/')) {
        return next(new Error('fromPath must start with /'));
    }

    // Ensure toPath is valid (starts with / or is full URL)
    if (!this.toPath.startsWith('/') && !this.toPath.startsWith('http://') && !this.toPath.startsWith('https://')) {
        return next(new Error('toPath must start with / or be a full URL'));
    }

    // Prevent self-redirects
    if (this.fromPath === this.toPath) {
        return next(new Error('Cannot redirect a path to itself'));
    }

    next();
});

export default mongoose.model('Redirect', redirectSchema);
