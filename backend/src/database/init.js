import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Définition de __dirname dans ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  try {
    // Lire le fichier SQL
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Exécuter le script SQL
    await pool.query(sql);
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
};

export default initDatabase;
