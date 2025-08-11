// controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, password,role} = req.body;
  try {
    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);
    const id = await userModel.createUser({ name, email, password_hash: hash, address, role });
    return res.status(201).json({ id, message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: 'oldPassword & newPassword required' });
  try {
    const userRow = await userModel.findById(req.user.id);
    const match = await bcrypt.compare(oldPassword, (await require('../db') .query('SELECT password_hash FROM users WHERE id=?', [req.user.id]))[0][0].password_hash);
    // Using a safer approach: directly query password_hash
    const pool = require('../db');
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const password_hash = rows[0].password_hash;
    const ok = await bcrypt.compare(oldPassword, password_hash);
    if (!ok) return res.status(400).json({ message: 'Old password is incorrect' });
    const newHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login, changePassword };
