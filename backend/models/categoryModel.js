const { pool } = require('../config/db');
const db = require('../config/db');
class Category {
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    return rows.length ? rows[0] : null;
  }

  static async create(categoryData) {
    const { name, description } = categoryData;
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  }

  static async update(id, categoryData) {
    const { name, description } = categoryData;
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Category;