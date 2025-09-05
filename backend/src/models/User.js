// src/models/User.js
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export class UserModel {
  // Créer un nouvel utilisateur
  static async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [user.email, hashedPassword, user.name]
    );
    return result.rows[0];
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
