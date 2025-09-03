import pool from '../config/database';
import fs from 'fs';
import path from 'path';

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