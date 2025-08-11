// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation } = require('../middleware/validators');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');

router.post('/signup', signupValidation, authController.signup);
router.post('/login', [ body('email').isEmail(), body('password').exists() ], authController.login);
router.put('/password', auth, [ body('oldPassword').exists(), body('newPassword').matches(require('../config/constants').PASSWORD_REGEX) ], authController.changePassword);

module.exports = router;
