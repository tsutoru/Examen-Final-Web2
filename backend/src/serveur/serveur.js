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
import budgetRoutes from './routes/budgetRoutes.js';
import { seedCategories } from '../config/seedCattegorie.js';
;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5432;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/budget', budgetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'API de gestion de dépenses fonctionne!' });
});

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connexion à PostgreSQL réussie');

    await seedCategories(); // Tu peux l'appeler ici

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
