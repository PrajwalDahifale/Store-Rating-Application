// controllers/storeController.js
const { validationResult } = require('express-validator');
const storeModel = require('../models/storeModel');
const pool = require('../db');

async function listStores(req, res) {
  try {
    const { qName, qAddress ,sortField='name', sortDir='asc', page=1, limit=20 } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const userId = req.user ? req.user.id : null;
    const stores = await storeModel.listStores({ qName, qAddress, sortField, sortDir, limit, offset, userId });
    res.json({ data: stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}



async function createStore(req, res) {
  const { name, email, address, owner_id } = req.body;
  if (!name || !owner_id) return res.status(400).json({ message: 'Name and owner_id required' });
  try {
    // confirm owner exists and is owner
    const [owner] = await pool.query('SELECT id FROM users WHERE id = ? AND role = "owner"', [owner_id]);
    if (!owner.length) return res.status(400).json({ message: 'owner_id invalid or not an owner' });
    const id = await storeModel.createStore({ owner_id, name, email, address });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listStores, createStore };
