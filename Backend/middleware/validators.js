// middleware/validators.js
const { body } = require('express-validator');
const { PASSWORD_REGEX, NAME_MIN, NAME_MAX, ADDRESS_MAX } = require('../config/constants');

const signupValidation = [
  body('name').isString().isLength({ min: NAME_MIN, max: NAME_MAX }).withMessage(`Name must be between ${NAME_MIN} and ${NAME_MAX} characters`),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').optional({ nullable: true }).isLength({ max: ADDRESS_MAX }).withMessage(`Address max ${ADDRESS_MAX} chars`),
  body('password').matches(PASSWORD_REGEX).withMessage('Password must be 8-16 chars, include uppercase and a special character'),
];

const createUserByAdmin = [
  body('name').isString().isLength({ min: NAME_MIN, max: NAME_MAX }),
  body('email').isEmail(),
  body('address').optional({ nullable: true }).isLength({ max: ADDRESS_MAX }),
  body('password').matches(PASSWORD_REGEX),
  body('role').isIn(['admin','user','owner'])
];

module.exports = { signupValidation, createUserByAdmin };
