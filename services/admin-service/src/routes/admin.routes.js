const router = require('express').Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  login, seedAdmin, getStats,
  getUsers, deleteUser, banUser,
  getListings, deleteListing,
} = require('../controllers/admin.controller');

// Auth
router.post('/login', login);
router.post('/seed', seedAdmin);

// Stats
router.get('/stats', verifyAdmin, getStats);

// Users
router.get('/users', verifyAdmin, getUsers);
router.delete('/users/:id', verifyAdmin, deleteUser);
router.patch('/users/:id/ban', verifyAdmin, banUser);

// Listings
router.get('/listings', verifyAdmin, getListings);
router.delete('/listings/:id', verifyAdmin, deleteListing);

module.exports = router;