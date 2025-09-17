// backend/controllers/redirect.controller.js

const Url = require('../models/url.model');
const GuestUrl = require('../models/guestUrl.model'); 
const Analytics = require('../models/analytics.model');

const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        let linkDocument;
        let isGuestLink = false;

        linkDocument = await Url.findOne({ shortCode });

        if (!linkDocument) {
            linkDocument = await GuestUrl.findOne({ shortCode });
            if (linkDocument) {
                isGuestLink = true;
            }
        }

        if (!linkDocument || (linkDocument.status && linkDocument.status === 'Inactive')) {
            return res.status(404).send('URL not found or is inactive.');
        }

        if (isGuestLink) {
            linkDocument.clicks += 1;
            await linkDocument.save();
        } else {
            const analyticsPromise = Analytics.create({
                url: linkDocument._id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer || 'Direct',
            });
            const clickIncrementPromise = Url.updateOne({ _id: linkDocument._id }, { $inc: { clicks: 1 } });
            
            Promise.all([analyticsPromise, clickIncrementPromise]).catch(err => {
                console.error("Error logging analytics:", err);
            });
        }
        return res.redirect(301, linkDocument.originalUrl);

    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = { redirectToOriginalUrl };