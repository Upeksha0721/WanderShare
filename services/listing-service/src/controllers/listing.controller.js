const Listing = require('../models/Listing');

// GET all listings
exports.getListings = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = search ? { $text: { $search: search } } : {};

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single listing
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create listing
exports.createListing = async (req, res) => {
  try {
    const { title, location, imageUrl, description, price } = req.body;
    const listing = await Listing.create({
      title, location, imageUrl, description,
      price: price || null,
      creatorId: req.user.id,
      creatorName: req.user.name,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT update listing
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.creatorId !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.creatorId !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST like/unlike
exports.toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });

    const idx = listing.likes.indexOf(req.user.id);
    if (idx === -1) listing.likes.push(req.user.id);
    else listing.likes.splice(idx, 1);

    await listing.save();
    res.json({ likes: listing.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};