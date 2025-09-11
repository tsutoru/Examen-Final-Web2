// routes/budgetRoutes.js
import express from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../../controllers/budgetController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;