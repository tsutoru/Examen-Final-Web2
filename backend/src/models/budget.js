// models/Budget.js
import pool from '../config/database.js';

class BudgetModel {
  // Créer un nouveau budget
  static async create(budget) {
    const { user_id, category_id, amount, month } = budget;
    const result = await pool.query(
        `INSERT INTO budgets (user_id, category_id, amount, month) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
        [user_id, category_id, amount, month]
    );
    return result.rows[0];
  }

  // Récupérer tous les budgets d'un utilisateur pour un mois donné
  static async findByUserIdAndMonth(userId, month) {
    const result = await pool.query(
        `SELECT b.*, c.name as category_name 
       FROM budgets b 
       JOIN categories c ON b.category_id = c.id 
       WHERE b.user_id = $1 AND b.month = $2`,
        [userId, month]
    );
    return result.rows;
  }

  // Mettre à jour un budget
  static async update(id, userId, updates) {
    const { amount } = updates;
    const result = await pool.query(
        `UPDATE budgets 
       SET amount = $1, updated_at = NOW() 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
        [amount, id, userId]
    );
    return result.rows[0];
  }

  // Supprimer un budget
  static async delete(id, userId) {
    const result = await pool.query(
        'DELETE FROM budgets WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return result.rowCount > 0;
  }
}

export default BudgetModel;