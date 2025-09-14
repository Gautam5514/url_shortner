// backend/models/analytics.model.js

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    url: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Url',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String, // Browser, OS info
    },
    referer: {
        type: String, // Where the click came from
    }
});

// Index for fast querying of analytics data for a specific URL
analyticsSchema.index({ url: 1 });
// Index for time-based queries (e.g., "clicks in the last 30 days")
analyticsSchema.index({ timestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;