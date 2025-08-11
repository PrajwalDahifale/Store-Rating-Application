// controllers/ratingController.js
const { validationResult } = require('express-validator');
const ratingModel = require('../models/ratingModel');

async function submitRating(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { store_id, rating, comment } = req.body;
  try {
    await ratingModel.upsertRating(req.user.id, store_id, rating, comment || null);
    res.json({ message: 'Rating submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMyRating(req, res) {
  const storeId = parseInt(req.params.storeId);
  const rating = await ratingModel.getUserRatingForStore(req.user.id, storeId);
  res.json({ rating });
}

async function ownerRatingsForStore(req, res) {
  const storeId = parseInt(req.params.storeId);
  // verify owner owns the store
  const pool = require('../db');
  const [rows] = await pool.query('SELECT id FROM stores WHERE id = ? AND owner_id = ?', [storeId, req.user.id]);
  if (!rows.length) return res.status(403).json({ message: 'You do not own this store' });
  const ratings = await ratingModel.getRatingsForStore(storeId);
  const summary = await ratingModel.getSummaryForStore(storeId);
  res.json({ ratings, summary });
}


module.exports = { submitRating, getMyRating, ownerRatingsForStore };
