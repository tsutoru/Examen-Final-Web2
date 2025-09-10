// routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetControllers');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;