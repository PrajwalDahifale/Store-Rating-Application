// seedAdmin.js
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS||10);
    const adminPass = await bcrypt.hash('Admin@1234', salt);
    const ownerPass = await bcrypt.hash('Owner@1234', salt);
    const [a] = await pool.query('INSERT IGNORE INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)',
      ['System Administrator Example Name!!!!!', 'admin@example.com', adminPass, 'Admin address', 'admin']);
    const [o] = await pool.query('INSERT IGNORE INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)',
      ['Store Owner Example Name!!!!!!!!!!!', 'owner@example.com', ownerPass, 'Owner address', 'owner']);
    console.log('Seeded admin & owner. Check users table.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
