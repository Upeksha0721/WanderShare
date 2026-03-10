const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ── Auth ──────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) return res.json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashed,
    });
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Stats ─────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const authDB = mongoose.connection.useDb('wandershare-auth');
    const listingDB = mongoose.connection.useDb('wandershare-listings');

    const UserModel = authDB.model('User',
      new mongoose.Schema({ name: String, email: String, createdAt: Date }, { timestamps: true })
    );
    const ListingModel = listingDB.model('Listing',
      new mongoose.Schema({
        title: String, location: String, creatorName: String,
        likes: [String], createdAt: Date,
      }, { timestamps: true })
    );

    const totalUsers = await UserModel.countDocuments();
    const totalListings = await ListingModel.countDocuments();

    // New users per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersData = await UserModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Most liked listings
    const mostLiked = await ListingModel.find()
      .sort({ likes: -1 }).limit(5)
      .select('title location likes creatorName');

    // Listings by location
    const byLocation = await ListingModel.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 6 },
    ]);

    res.json({ totalUsers, totalListings, newUsersData, mostLiked, byLocation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Users ─────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const authDB = mongoose.connection.useDb('wandershare-auth');
    const UserModel = authDB.model('User',
      new mongoose.Schema({
        name: String, email: String, isBanned: { type: Boolean, default: false },
      }, { timestamps: true })
    );
    const users = await UserModel.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const authDB = mongoose.connection.useDb('wandershare-auth');
    const UserModel = authDB.model('User',
      new mongoose.Schema({ name: String, email: String }, { timestamps: true })
    );
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const authDB = mongoose.connection.useDb('wandershare-auth');
    const UserModel = authDB.model('User',
      new mongoose.Schema({
        name: String, email: String, isBanned: { type: Boolean, default: false },
      }, { timestamps: true })
    );
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ message: user.isBanned ? 'User banned' : 'User unbanned', isBanned: user.isBanned });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Listings ──────────────────────────────────────────
exports.getListings = async (req, res) => {
  try {
    const listingDB = mongoose.connection.useDb('wandershare-listings');
    const ListingModel = listingDB.model('Listing',
      new mongoose.Schema({
        title: String, location: String, description: String,
        imageUrl: String, price: Number, creatorName: String,
        likes: [String], createdAt: Date,
      }, { timestamps: true })
    );
    const listings = await ListingModel.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listingDB = mongoose.connection.useDb('wandershare-listings');
    const ListingModel = listingDB.model('Listing',
      new mongoose.Schema({ title: String }, { timestamps: true })
    );
    await ListingModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};