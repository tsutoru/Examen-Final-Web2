const pool = require('../config/database');

class TransactionModel {
  // Créer une nouvelle transaction
  static async create(transaction) {
    const result = await pool.query(
        `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
        [
          transaction.user_id,
          transaction.account_id,
          transaction.category_id,
          transaction.amount,
          transaction.type,
          transaction.description,
          transaction.date
        ]
    );
    return result.rows[0];
  }

  // Récupérer toutes les transactions d'un utilisateur
  static async findByUserId(userId) {
    const result = await pool.query(
        `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = $1 
       ORDER BY t.date DESC`,
        [userId]
    );
    return result.rows;
  }

  // Récupérer une transaction par son ID
  static async findById(id, userId) {
    const result = await pool.query(
        'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Mettre à jour une transaction
  static async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Construire dynamiquement la requête en fonction des champs à mettre à jour
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }

    values.push(id, userId);
    const query = `UPDATE transactions SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows.length ? result.rows[0] : null;
  }

  // Supprimer une transaction
  static async delete(id, userId) {
    const result = await pool.query(
        'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return result.rowCount > 0;
  }

  // Récupérer le solde total d'un utilisateur
  static async getBalance(userId) {
    const result = await pool.query(
        `SELECT 
        COALESCE(SUM(CASE WHEN type = 'revenu' THEN amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type = 'depense' THEN amount ELSE 0 END), 0) as balance
       FROM transactions 
       WHERE user_id = $1`,
        [userId]
    );
    return parseFloat(result.rows[0].balance) || 0;
  }
}

module.exports = TransactionModel;
