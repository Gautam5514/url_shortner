// backend/models/guestUrl.model.js

const mongoose = require('mongoose');

const guestUrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
    clicks: {
        type: Number,
        default: 0,
    },
});

guestUrlSchema.index({ shortCode: 1 });

const GuestUrl = mongoose.model('GuestUrl', guestUrlSchema);

module.exports = GuestUrl;