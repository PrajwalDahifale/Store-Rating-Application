// middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // fetch minimal user
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid token' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { auth, permit };
