const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.signupPage = (req, res) => {
  res.render('signup', { error: null });
};

exports.signup = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  // Check if email already exists
  const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return res.render('signup', { error: 'Email is already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (full_name, email, phone, password) VALUES ($1, $2, $3, $4)',
    [fullName, email, phone, hashedPassword]
  );
  res.redirect('/login');
};

exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.session.userId = user.id;
      return res.redirect('/jobs');
    }
  }
  // Show error if login fails
  res.render('login', { error: 'Incorrect email or password' });
};

exports.logout = (req, res) => {
  // Clear the session
  req.session.destroy(() => {
    // Set cache control headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    // Redirect to home page
    res.redirect('/');
  });
};
