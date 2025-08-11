const pool = require('../db');

async function upsertRating(user_id, store_id, rating, comment) {
  const sql = `INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?,?,?,?)
               ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), updated_at = CURRENT_TIMESTAMP`;
  await pool.query(sql, [user_id, store_id, rating, comment]);
}

async function getUserRatingForStore(user_id, store_id) {
  const [rows] = await pool.query('SELECT id, rating, comment FROM ratings WHERE user_id = ? AND store_id = ?', [user_id, store_id]);
  return rows[0] || null;
}

async function getRatingsForStore(store_id) {
  const [rows] = await pool.query(`SELECT r.id, r.rating, r.comment, r.created_at, u.id as user_id, u.name as user_name, u.email, u.address
    FROM ratings r JOIN users u ON u.id = r.user_id WHERE r.store_id = ? ORDER BY r.created_at DESC`, [store_id]);
  return rows;
}

async function getSummaryForStore(store_id) {
  const [rows] = await pool.query('SELECT ROUND(AVG(rating),2) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE store_id = ?', [store_id]);
  return rows[0];
}

module.exports = { upsertRating, getUserRatingForStore, getRatingsForStore, getSummaryForStore };
