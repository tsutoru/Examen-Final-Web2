// models/Category.js
import pool from '../config/database.js';

class CategoryModel {
  // Récupérer toutes les catégories d'un utilisateur
  static async findByUserId(userId) {
    const result = await pool.query(
        `SELECT 
      id,
      name_categorie AS name,
      type,
      color,
      icon
     FROM categories
     WHERE user_id = $1
     ORDER BY name_categorie`,
        [userId]
    );
    return result.rows;
  }

// Créer une nouvelle catégorie
  static async create(category) {
    const { user_id, name_categorie, type, color, icon } = category;
    const result = await pool.query(
        `INSERT INTO categories (user_id, name_categorie, type, color, icon) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
        [user_id, name_categorie, type, color, icon]
    );
    return result.rows[0];
  }


}

export default CategoryModel;