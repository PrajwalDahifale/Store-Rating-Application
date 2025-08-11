// routes/stores.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { auth, permit } = require('../middleware/auth');
const { body } = require('express-validator');

// listing accessible to logged-in users
router.get('/', auth, storeController.listStores);



// admin can create stores
router.post('/', auth, permit('admin','owner'), [
  body('name').isLength({ min: 1 }).withMessage('Name required'),
  body('owner_id').isInt().withMessage('owner_id required')
], storeController.createStore);

module.exports = router;
