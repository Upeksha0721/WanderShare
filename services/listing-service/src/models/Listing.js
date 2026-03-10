const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: null },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  likes: [{ type: String }],
}, { timestamps: true });

// Index for search & performance
ListingSchema.index({ title: 'text', location: 'text', description: 'text' });
ListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', ListingSchema);