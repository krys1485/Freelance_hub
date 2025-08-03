const pool = require('./db');

const checkTables = async () => {
  try {
    // Check users table
    const usersResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log('Users table exists:', usersResult.rows[0].exists);

    // Check jobs table
    const jobsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'jobs'
      );
    `);
    console.log('Jobs table exists:', jobsResult.rows[0].exists);

    // If tables exist, show their structure
    if (usersResult.rows[0].exists) {
      const usersStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `);
      console.log('\nUsers table structure:');
      usersStructure.rows.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type}`);
      });
    }

    if (jobsResult.rows[0].exists) {
      const jobsStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs';
      `);
      console.log('\nJobs table structure:');
      jobsStructure.rows.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type}`);
      });
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  }
};

const initializeDatabase = async () => {
  try {
    // Create users table first
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

    // Then create jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        contact VARCHAR(20),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
    `);
    console.log('✅ Jobs table created successfully');

    // Check tables after creation
    await checkTables();

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = initializeDatabase; 