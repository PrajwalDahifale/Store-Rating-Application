const pool = require('../db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}
async function findById(id) {
  const [rows] = await pool.query('SELECT id, name, email, address, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}
async function createUser({ name, email, password_hash, address, role = 'user' }) {
  const [result] = await pool.query('INSERT INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)', [name, email, password_hash, address, role]);
  return result.insertId;
}
async function listUsers({ name, email, address, role, sortField='name', sortDir='ASC', limit=20, offset=0 }) {
  let sql = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
  const params = [];
  if (name) { sql += ' AND name LIKE ?'; params.push(`%${name}%`); }
  if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }
  if (address) { sql += ' AND address LIKE ?'; params.push(`%${address}%`); }
  if (role) { sql += ' AND role = ?'; params.push(role); }
  const allowed = { name: 'name', email: 'email', address: 'address', role: 'role' };
  sql += ` ORDER BY ${allowed[sortField] || 'name'} ${sortDir === 'DESC' ? 'DESC' : 'ASC'} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { findByEmail, findById, createUser, listUsers };
