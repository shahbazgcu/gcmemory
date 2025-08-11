const { pool } = require('../config/db');



class Memory {
  static async getAll(limit = 50, offset = 0) {
    const [rows] = await pool.query(
      `SELECT m.*, c.name as category_name, u.name as uploader_name 
       FROM memories m 
       LEFT JOIN categories c ON m.category_id = c.id 
       LEFT JOIN users u ON m.uploaded_by = u.id 
       ORDER BY m.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, c.name as category_name, u.name as uploader_name 
       FROM memories m 
       LEFT JOIN categories c ON m.category_id = c.id 
       LEFT JOIN users u ON m.uploaded_by = u.id 
       WHERE m.id = ?`,
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  static async create(memoryData) {
    const {
      title,
      description,
      image_path,
      thumbnail_path,
      category_id,
      year,
      location,
      department,
      source,
      keywords,
      uploaded_by,
      file_size
    } = memoryData;

    const [result] = await pool.query(
      `INSERT INTO memories (
        title, description, image_path, thumbnail_path, 
        category_id, year, location, department, 
        source, keywords, uploaded_by, file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, image_path, thumbnail_path,
        category_id, year, location, department,
        source, keywords, uploaded_by, file_size
      ]
    );
    return result.insertId;
  }

  static async update(id, memoryData) {
    const {
      title,
      description,
      image_path,
      thumbnail_path,
      category_id,
      year,
      location,
      department,
      source,
      keywords,
      file_size
    } = memoryData;

    // Only update fields that are provided
    let queryParts = [];
    let values = [];

    if (title !== undefined) {
      queryParts.push('title = ?');
      values.push(title);
    }

    if (description !== undefined) {
      queryParts.push('description = ?');
      values.push(description);
    }

    if (image_path !== undefined) {
      queryParts.push('image_path = ?');
      values.push(image_path);
    }

    if (thumbnail_path !== undefined) {
      queryParts.push('thumbnail_path = ?');
      values.push(thumbnail_path);
    }

    if (category_id !== undefined) {
      queryParts.push('category_id = ?');
      values.push(category_id);
    }

    if (year !== undefined) {
      queryParts.push('year = ?');
      values.push(year);
    }

    if (location !== undefined) {
      queryParts.push('location = ?');
      values.push(location);
    }

    if (department !== undefined) {
      queryParts.push('department = ?');
      values.push(department);
    }

    if (source !== undefined) {
      queryParts.push('source = ?');
      values.push(source);
    }

    if (keywords !== undefined) {
      queryParts.push('keywords = ?');
      values.push(keywords);
    }

    if (file_size !== undefined) {
      queryParts.push('file_size = ?');
      values.push(file_size);
    }

    if (queryParts.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE memories SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM memories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async search(query, filters = {}, limit = 50, offset = 0) {
    let sqlQuery = `
      SELECT m.*, c.name as category_name, u.name as uploader_name
      FROM memories m
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    // Full text search if query is provided
    if (query && query.trim().length > 0) {
      sqlQuery += ` AND MATCH(m.title, m.description, m.keywords, m.location, m.department) 
                   AGAINST(? IN NATURAL LANGUAGE MODE)`;
      queryParams.push(query);
    }

    // Apply filters
    if (filters.category_id) {
      sqlQuery += ' AND m.category_id = ?';
      queryParams.push(filters.category_id);
    }

    if (filters.year) {
      sqlQuery += ' AND m.year = ?';
      queryParams.push(filters.year);
    }

    if (filters.department) {
      sqlQuery += ' AND m.department LIKE ?';
      queryParams.push(`%${filters.department}%`);
    }

    if (filters.location) {
      sqlQuery += ' AND m.location LIKE ?';
      queryParams.push(`%${filters.location}%`);
    }

    // Order by and pagination
    sqlQuery += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.query(sqlQuery, queryParams);
    return rows;
  }

  static async getRelated(memoryId, categoryId, limit = 8) {
    // Get related images in the same category, excluding the current one
    const [rows] = await pool.query(
      `SELECT m.*, c.name as category_name
       FROM memories m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.category_id = ? AND m.id != ?
       ORDER BY RAND()
       LIMIT ?`,
      [categoryId, memoryId, limit]
    );
    return rows;
  }

  static async getYears() {
    // Get distinct years for filtering
    const [rows] = await pool.query(
      'SELECT DISTINCT year FROM memories WHERE year IS NOT NULL ORDER BY year DESC'
    );
    return rows.map(row => row.year);
  }

  static async getDepartments() {
    // Get distinct departments for filtering
    const [rows] = await pool.query(
      'SELECT DISTINCT department FROM memories WHERE department IS NOT NULL ORDER BY department'
    );
    return rows.map(row => row.department);
  }

  static async getLocations() {
    // Get distinct locations for filtering
    const [rows] = await pool.query(
      'SELECT DISTINCT location FROM memories WHERE location IS NOT NULL ORDER BY location'
    );
    return rows.map(row => row.location);
  }

  static async getTotal(filters = {}, searchQuery = '') {
    let sqlQuery = 'SELECT COUNT(*) as total FROM memories m WHERE 1=1';
    const queryParams = [];

    // Apply search query
    if (searchQuery && searchQuery.trim().length > 0) {
      sqlQuery += ` AND MATCH(m.title, m.description, m.keywords, m.location, m.department) 
                   AGAINST(? IN NATURAL LANGUAGE MODE)`;
      queryParams.push(searchQuery);
    }

    // Apply filters
    if (filters.category_id) {
      sqlQuery += ' AND m.category_id = ?';
      queryParams.push(filters.category_id);
    }

    if (filters.year) {
      sqlQuery += ' AND m.year = ?';
      queryParams.push(filters.year);
    }

    if (filters.department) {
      sqlQuery += ' AND m.department LIKE ?';
      queryParams.push(`%${filters.department}%`);
    }

    if (filters.location) {
      sqlQuery += ' AND m.location LIKE ?';
      queryParams.push(`%${filters.location}%`);
    }

    const [rows] = await pool.query(sqlQuery, queryParams);
    return rows[0].total;
  }
}

module.exports = Memory;