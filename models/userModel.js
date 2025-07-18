const pool = require('../config/db');

const User = {
  create: async (username, email, passwordHash) => {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
  },

  update: async (userId, username, email) => {
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
      [username, email, userId]
    );
    return result.affectedRows;
  }
};

module.exports = User;