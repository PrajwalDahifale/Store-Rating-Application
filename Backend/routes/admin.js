// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, permit } = require('../middleware/auth');
const { createUserByAdmin } = require('../middleware/validators');

router.get('/dashboard', auth, permit('admin'), adminController.dashboard);
router.get('/users', auth, permit('admin'), adminController.listUsers);
router.post('/users', auth, permit('admin'), createUserByAdmin, adminController.createUserByAdmin);
router.get('/stores', auth, permit('admin'), adminController.listStores);

module.exports = router;
