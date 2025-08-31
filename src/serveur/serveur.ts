import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../config/database.ts';
import initDatabase from '../database/init.ts';

// Import des routes
import authRoutes from '../routes/authRoutes';
import transactionRoutes from '../routes/transactionRoutes';
import accountRoutes from './routes/accountRoutes';
import categoryRoutes from './routes/categoryRoutes';
import savingsRoutes from './routes/savingsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse les corps de requêtes en JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/savings', savingsRoutes);

// Route de santé pour tester l'API
app.get('/api/health', (req, res) => {
  res.json({ message: 'API de gestion de dépenses fonctionne!' });
});

// Initialisation et démarrage du serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    await pool.query('SELECT NOW()');
    console.log('✅ Connexion à PostgreSQL réussie');
    
    // Initialiser la base de données
    await initDatabase();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1); // Quitter le processus en cas d'erreur
  }
};

startServer();