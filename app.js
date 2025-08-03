const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const initializeDatabase = require('./config/initDb');
require('dotenv').config();

const app = express();

// Initialize database before starting server
initializeDatabase().then(() => {
  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // View engine
  app.set('view engine', 'ejs');

  // Sessions & flash
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());

  // Middleware to log requests
  app.use((req, res, next) => {
    console.log('➡️ HTTP Method (before override):', req.method, '| Path:', req.path);
    next();
  });

  // Method override for PUT and DELETE
  app.use(methodOverride('_method'));

  // Middleware to log after override
  app.use((req, res, next) => {
    console.log('✅ After override:', req.method, '| Path:', req.path);
    next();
  });

  // Cache control middleware
  app.use((req, res, next) => {
    // Don't cache authenticated pages
    if (req.session.userId) {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }
    next();
  });

  // Middleware to pass user ID and flash to views
  app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    res.locals.flash = req.flash();
    next();
  });

  // Routes
  const authRoutes = require('./routes/authRoutes');
  const indexRoutes = require('./routes/indexRoutes');
  app.use('/', authRoutes);
  app.use('/', indexRoutes);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
