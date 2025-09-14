// backend/models/url.model.js

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This links the URL to a specific user
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true, // Every short code MUST be unique
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: 'Untitled Link',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  clicks: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create an index on shortCode for fast lookups during redirection
urlSchema.index({ shortCode: 1 });
// Create an index on the user field to quickly find all links for a user
urlSchema.index({ user: 1 });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;