const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin-gcu',
  password: process.env.DB_PASSWORD || 'dit218.',
  database: process.env.DB_NAME || 'gcumemories',
  port: process.env.DB_PORT || 3310,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const promisePool = pool.promise();

// Create required tables if they don't exist
async function initializeDatabase() {
  try {
    // Create users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        role enum('admin','user','public') DEFAULT 'public',
        password_hash varchar(255) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id)
      )
    `);

    // Create categories table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        description text DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id)
      )
    `);

    // Create memories table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id int(11) NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        description text DEFAULT NULL,
        image_path varchar(500) NOT NULL,
        thumbnail_path varchar(500) DEFAULT NULL,
        category_id int(11) DEFAULT NULL,
        year int(11) DEFAULT NULL,
        location varchar(255) DEFAULT NULL,
        department varchar(255) DEFAULT NULL,
        source varchar(255) DEFAULT NULL,
        keywords text DEFAULT NULL,
        uploaded_by int(11) DEFAULT NULL,
        file_size int(11) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id),
        KEY category_id (category_id),
        KEY uploaded_by (uploaded_by),
        FULLTEXT KEY search_idx (title, description, keywords, location, department),
        CONSTRAINT memories_ibfk_1 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
        CONSTRAINT memories_ibfk_2 FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `);

    // Insert default admin user if not exists
    await promisePool.query(`
      INSERT INTO users (name, email, role, password_hash) 
      SELECT 'Admin', 'admin@gcumemories.com', 'admin', '$2a$12$kIVuQgA7C6RAMwz6.2UwI.7V/XRH864kC4sBfkvv9gXfDLsDnvXI.' 
      FROM dual 
      WHERE NOT EXISTS (SELECT * FROM users WHERE email = 'admin@gcumemories.com' LIMIT 1)
    `);

    // Insert default categories if not exists
    const defaultCategories = [
      ['Events', 'Convocations, Seminars, Visits'],
      ['Personalities', 'Faculty, Alumni, Guests'],
      ['Departments / Faculties', 'Academic departments and faculties'],
      ['Buildings & Campus', 'Infrastructure and campus views'],
      ['Historical Documents', 'Historical documents and archives'],
      ['Student Life', 'Student activities and campus life'],
      ['Press Coverage / Media', 'Media coverage and press releases']
    ];

    for (const [name, description] of defaultCategories) {
      await promisePool.query(`
        INSERT INTO categories (name, description) 
        SELECT ?, ? 
        FROM dual 
        WHERE NOT EXISTS (SELECT * FROM categories WHERE name = ? LIMIT 1)
      `, [name, description, name]);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

module.exports = {
  pool: promisePool,
  initializeDatabase
};