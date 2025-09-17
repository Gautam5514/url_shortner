// backend/models/url.model.js

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
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
  timestamps: true, 
});

urlSchema.index({ shortCode: 1 });
urlSchema.index({ user: 1 });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;