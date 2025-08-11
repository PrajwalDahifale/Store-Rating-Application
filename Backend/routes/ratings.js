// routes/ratings.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { auth, permit } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/', auth, [
  body('store_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString().isLength({ max: 1000 })
], ratingController.submitRating);

router.get('/my/:storeId', auth, ratingController.getMyRating);
router.get('/store/:storeId', auth, permit('owner','admin'), ratingController.ownerRatingsForStore);

module.exports = router;
