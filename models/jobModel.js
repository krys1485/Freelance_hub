const pool = require('../config/db');

exports.getAllJobs = () => pool.query('SELECT * FROM jobs ORDER BY created_at DESC');

exports.createJob = (title, description, price, contact, userId) =>
  pool.query('INSERT INTO jobs (title, description, price, contact, user_id) VALUES ($1, $2, $3, $4, $5)',
    [title, description, price, contact, userId]);

exports.getJobById = (id, userId) =>
  pool.query('SELECT * FROM jobs WHERE id = $1 AND user_id = $2', [id, userId]);

exports.updateJob = (id, title, description, price, contact, userId) =>
  pool.query('UPDATE jobs SET title=$1, description=$2, price=$3, contact=$4 WHERE id=$5 AND user_id=$6',
    [title, description, price, contact, id, userId]);

exports.deleteJob = (id, userId) =>
  pool.query('DELETE FROM jobs WHERE id=$1 AND user_id=$2', [id, userId]);
