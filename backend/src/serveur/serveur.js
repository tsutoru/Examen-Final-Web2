
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../config/database.js';
import initDatabase from '../database/init.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import savingsRoutes from './routes/savingsRoutes.js';

// ... autres imports
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// ... après les autres routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5432;


app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse les corps de requêtes en JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budget', budgetRoutes);

// Route de santé pour tester l'API
app.get('/api/health', (req, res) => {
  res.json({ message: 'API de gestion de dépenses fonctionne!' });
});

// Initialisation et démarrage du serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    await pool.query('SELECT NOW()');
    console.log(' Connexion à PostgreSQL réussie');

    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(` Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error(' Erreur lors du démarrage du serveur:', error);
    process.exit(1); // Quitter le processus en cas d'erreur
  }
};
// Après la connexion à la base de données
await pool.query('SELECT NOW()');
console.log(' Connexion à PostgreSQL réussie');

// Créer les catégories par défaut
const seedCategories = require('./database/seedCategories');
await seedCategories();

startServer();