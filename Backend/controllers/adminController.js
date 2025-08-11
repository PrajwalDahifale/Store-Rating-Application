// controllers/adminController.js
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const pool = require('../db');
const bcrypt = require('bcrypt');

async function dashboard(req, res) {
  try {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_stores }]] = await pool.query('SELECT COUNT(*) as total_stores FROM stores');
    const [[{ total_ratings }]] = await pool.query('SELECT COUNT(*) as total_ratings FROM ratings');
    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortField, sortDir, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const data = await userModel.listUsers({ name, email, address, role, sortField, sortDir, limit, offset });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createUserByAdmin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password, role } = req.body;
  try {
    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));
    const id = await userModel.createUser({ name, email, password_hash: hash, address, role });
    res.status(201).json({ id, message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listStores(req, res) {
  try {
    // similar to storeModel.listStores but admin can pass userId=0
    const { qName, qAddress, sortField='name', sortDir='asc', page=1, limit=20 } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const stores = await storeModel.listStores({ qName, qAddress, sortField, sortDir, limit, offset, userId: 0 });
    res.json({ data: stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { dashboard, listUsers, createUserByAdmin, listStores };
