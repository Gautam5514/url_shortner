// backend/controllers/url.controller.js

const Url = require('../models/url.model');
const Analytics = require('../models/analytics.model');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

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

const getUserUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(urls);
    } catch (error) {
        console.error('Error fetching user URLs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getUrlDetails = async (req, res) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this URL.' });
        }

        res.status(200).json(url);
    } catch (error) {
        console.error('Error fetching URL details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateUrl = async (req, res) => {
    try {
        const { title, description, status, originalUrl } = req.body;
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

    
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this URL.' });
        }
        
        
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


const deleteUrl = async (req, res) => {
    try {
        const url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

    
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this URL.' });
        }

        await Analytics.deleteMany({ url: url._id });
        await Url.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'URL and associated analytics removed successfully.', id: req.params.id });

    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

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

        
        if (url.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view these stats.' });
        }

        const totalClicks = url.clicks;
        
        const uniqueClicks = await Analytics.distinct('ipAddress', { url: urlId }).countDocuments();

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
                $sort: { _id: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id", 
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



module.exports = {
    createShortUrl,
    getUserUrls,
    getUrlDetails,
    updateUrl,
    deleteUrl,
    getUrlStats,
};