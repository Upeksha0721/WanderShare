const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  toggleLike
} = require('../controllers/listing.controller');

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', verifyToken, createListing);
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);
router.post('/:id/like', verifyToken, toggleLike);

module.exports = router;