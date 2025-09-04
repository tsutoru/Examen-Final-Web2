import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Pool de connexions à PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps d'inactivité avant déconnexion
  connectionTimeoutMillis: 2000, // Temps d'attente pour une connexion
});

// Événement de connexion
pool.on('connect', () => {
  console.log('Connecté à la base de données PostgreSQL');
});

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});

export default pool;q