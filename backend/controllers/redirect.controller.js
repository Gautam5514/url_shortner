// backend/controllers/redirect.controller.js

const Url = require('../models/url.model');
const Analytics = require('../models/analytics.model');

const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode });

        if (!url || url.status === 'Inactive') {
            return res.status(404).send('URL not found or is inactive.');
        }

        // --- Important: Log analytics without blocking the redirect ---
        // We don't use 'await' here so the user is redirected immediately.
        // The database operations happen in the background.
        const analyticsPromise = Analytics.create({
            url: url._id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            referer: req.headers.referer || 'Direct',
        });
        
        const clickIncrementPromise = Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });
        
        // Handle promises to catch potential errors
        Promise.all([analyticsPromise, clickIncrementPromise]).catch(err => {
            console.error("Error logging analytics:", err);
        });
        // --- End of Analytics Logging ---

        // Redirect using a 301 (permanent) redirect
        return res.redirect(301, url.originalUrl);

    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = { redirectToOriginalUrl };