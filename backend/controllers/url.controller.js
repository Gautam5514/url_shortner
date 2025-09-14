// backend/controllers/url.controller.js

const Url = require('../models/url.model');
const Analytics = require('../models/analytics.model');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

// @desc    Create a new short URL
// @route   POST /api/urls
// @access  Private
const createShortUrl = async (req, res) => {
    const { originalUrl, customCode, title, description } = req.body;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    try {
        let shortCode;
        if (customCode) {
            const existing = await Url.findOne({ shortCode: customCode });
            if (existing) {
                return res.status(400).json({ message: 'That custom code is already in use.' });
            }
            shortCode = customCode;
        } else {
            // Generate a unique short code, ensuring it doesn't already exist
            do {
                shortCode = nanoid(7); // Generate a 7-character ID
            } while (await Url.findOne({ shortCode }));
        }

        const newUrl = new Url({
            user: req.user._id,
            originalUrl,
            shortCode,
            shortUrl: `${baseUrl}/${shortCode}`,
            title: title || 'Untitled Link',
            description: description || '',
        });

        await newUrl.save();
        res.status(201).json(newUrl);

    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ message: 'Server error while creating link.' });
    }
};

// @desc    Get all URLs for the logged-in user
// @route   GET /api/urls
// @access  Private
const getUserUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(urls);
    } catch (error) {
        console.error('Error fetching user URLs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get details for a single URL
// @route   GET /api/urls/:id
// @access  Private
const getUrlDetails = async (req, res) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        // --- Security Check: Ensure the user owns this URL ---
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this URL.' });
        }

        res.status(200).json(url);
    } catch (error) {
        console.error('Error fetching URL details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a URL's details
// @route   PUT /api/urls/:id
// @access  Private
const updateUrl = async (req, res) => {
    try {
        const { title, description, status, originalUrl } = req.body;
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        // --- Security Check: Ensure the user owns this URL ---
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this URL.' });
        }
        
        // Update fields if they are provided in the request body
        url.title = title ?? url.title;
        url.description = description ?? url.description;
        url.status = status ?? url.status;
        url.originalUrl = originalUrl ?? url.originalUrl;
        
        const updatedUrl = await url.save();
        res.status(200).json(updatedUrl);

    } catch (error) {
        console.error('Error updating URL:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
const deleteUrl = async (req, res) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        // --- Security Check: Ensure the user owns this URL ---
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this URL.' });
        }

        // Important: Also delete all associated analytics data to keep the DB clean
        await Analytics.deleteMany({ url: url._id });
        await Url.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'URL and associated analytics removed successfully.', id: req.params.id });

    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Get aggregated statistics for a URL
// @route   GET /api/urls/:id/stats
// @access  Private
const getUrlStats = async (req, res) => {
    try {
        const urlId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(urlId)) {
            return res.status(400).json({ message: 'Invalid URL ID format.' });
        }

        const url = await Url.findById(urlId);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        // --- Security Check: Ensure the user owns this URL ---
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view these stats.' });
        }

        // 1. Get total clicks from the URL model for efficiency
        const totalClicks = url.clicks;
        
        // 2. Calculate unique clicks by counting distinct IP addresses
        const uniqueClicks = await Analytics.distinct('ipAddress', { url: urlId }).countDocuments();

        // 3. Get click data for the last 30 days for the chart
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const clicksOverTime = await Analytics.aggregate([
            {
                $match: {
                    url: url._id,
                    timestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    clicks: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date ascending
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id", // Rename _id to name to match your chart's expected data key
                    clicks: "$clicks"
                }
            }
        ]);

        res.status(200).json({
            totalClicks,
            uniqueClicks,
            clicksOverTime,
        });

    } catch (error) {
        console.error('Error fetching URL stats:', error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};


// Don't forget to export all the new functions
module.exports = {
    createShortUrl,
    getUserUrls,
    getUrlDetails,
    updateUrl,
    deleteUrl,
    getUrlStats,
};