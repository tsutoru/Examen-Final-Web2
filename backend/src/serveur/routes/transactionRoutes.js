import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance
} from '../../controllers/transactionControllers.js';
import { authenticateToken } from '../../middleware/auth.js';


const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// GET /api/transactions - Récupérer toutes les transactions de l'utilisateur
router.get('/', getTransactions);

// POST /api/transactions - Créer une nouvelle transaction
router.post('/', createTransaction);

// GET /api/transactions/balance - Récupérer le solde de l'utilisateur
router.get('/balance', getBalance);

// GET /api/transactions/:id - Récupérer une transaction spécifique
router.get('/:id', getTransaction);

// PUT /api/transactions/:id - Mettre à jour une transaction
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id - Supprimer une transaction
router.delete('/:id', deleteTransaction);

export default router;