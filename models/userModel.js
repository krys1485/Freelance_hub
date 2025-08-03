const pool = require('../config/db');

// Create users table
const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✅ Users table created successfully');
    
    // After users table is created, try to create jobs table
    require('./jobModel');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  }
};

// Initialize table
createUsersTable();

// CRUD Operations
exports.createUser = (fullName, email, phone, password) =>
  pool.query('INSERT INTO users (full_name, email, phone, password) VALUES ($1, $2, $3, $4)',
    [fullName, email, phone, password]);

exports.getUserByEmail = (email) =>
  pool.query('SELECT * FROM users WHERE email = $1', [email]);

exports.getUserById = (id) =>
  pool.query('SELECT * FROM users WHERE id = $1', [id]);

exports.updateUser = (id, fullName, email, phone) =>
  pool.query('UPDATE users SET full_name=$1, email=$2, phone=$3 WHERE id=$4',
    [fullName, email, phone, id]);

exports.deleteUser = (id) =>
  pool.query('DELETE FROM users WHERE id=$1', [id]); 