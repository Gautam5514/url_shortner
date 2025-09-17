// backend/controllers/guestUrl.controller.js

const GuestUrl = require('../models/guestUrl.model');
const { nanoid } = require('nanoid');

const createGuestShortUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    try {
        let shortCode;
        // Generate a unique short code for the guest collection
        do {
            shortCode = nanoid(7);
        } while (await GuestUrl.findOne({ shortCode }));

        const newUrl = new GuestUrl({
            originalUrl,
            shortCode,
            shortUrl: `${baseUrl}/${shortCode}`,
        });

        await newUrl.save();
        res.status(201).json(newUrl);

    } catch (error) {
        console.error('Error creating guest URL:', error);
        res.status(500).json({ message: 'Server error while creating link.' });
    }
};

module.exports = { createGuestShortUrl };