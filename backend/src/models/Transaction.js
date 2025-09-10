// models/Transaction.js
const pool = require('../config/database');

class TransactionModel {
  // ... autres méthodes existantes ...

  // Créer une transaction avec mise à jour du compte
  static async create(transaction) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insérer la transaction
      const transactionResult = await client.query(
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

      // Mettre à jour le solde du compte
      const balanceChange = transaction.type === 'revenu' 
        ? transaction.amount 
        : -transaction.amount;

      await client.query(
        'UPDATE accounts SET balance = balance + $1, updated_at = NOW() WHERE id = $2',
        [balanceChange, transaction.account_id]
      );

      await client.query('COMMIT');
      return transactionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Supprimer une transaction avec mise à jour du compte
  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Récupérer la transaction
      const transactionResult = await client.query(
        'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (transactionResult.rows.length === 0) {
        return false;
      }

      const transaction = transactionResult.rows[0];

      // Supprimer la transaction
      await client.query(
        'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      // Inverser l'effet sur le compte
      const balanceChange = transaction.type === 'revenu' 
        ? -transaction.amount 
        : transaction.amount;

      await client.query(
        'UPDATE accounts SET balance = balance + $1, updated_at = NOW() WHERE id = $2',
        [balanceChange, transaction.account_id]
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = TransactionModel;