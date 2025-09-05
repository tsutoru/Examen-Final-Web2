// src/config/database.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // charger les variables d'environnement

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // forcer en string
  port: Number(process.env.DB_PORT)
});

pool.on('error', (err) => {
  console.error('Erreur de pool PostgreSQL :', err);
});

export default pool;
