const pool = require('../db');

async function createStore({ owner_id, name, email, address }) {
  const [res] = await pool.query('INSERT INTO stores (owner_id, name, email, address) VALUES (?,?,?,?)', [owner_id, name, email, address]);
  return res.insertId;
}

async function listStores({ 
  qName, 
  qAddress, 
  sortField = 'name', 
  sortDir = 'ASC', 
  limit = 20, 
  offset = 0, 
  userId 
}) {
  // returns avg_rating and user's rating (if userId provided)
  let sql = `
    SELECT 
      s.id, 
      s.name, 
      s.email, 
      s.address, 
      s.owner_id,   -- include owner_id in results
      COALESCE(AVG(r.rating), 0) AS avg_rating,
      (SELECT rating 
         FROM ratings ur 
         WHERE ur.user_id = ? 
           AND ur.store_id = s.id 
         LIMIT 1) AS user_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r 
      ON r.store_id = s.id
    WHERE 1=1
  `;

  const params = [userId || 0];

  if (qName) { 
    sql += ' AND s.name LIKE ?'; 
    params.push(`%${qName}%`); 
  }
  if (qAddress) { 
    sql += ' AND s.address LIKE ?'; 
    params.push(`%${qAddress}%`); 
  }

  sql += ' GROUP BY s.id, s.owner_id'; // group by owner_id too

  const allowed = { 
    name: 's.name', 
    email: 's.email', 
    address: 's.address', 
    avg_rating: 'avg_rating', 
    owner_id: 's.owner_id' 
  };

  sql += ` ORDER BY ${allowed[sortField] || 's.name'} ${sortDir === 'DESC' ? 'DESC' : 'ASC'} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  const [rows] = await pool.query(sql, params);
  return rows;
}




async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createStore, listStores, findById };
