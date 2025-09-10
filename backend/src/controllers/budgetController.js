// controllers/budgetControllers.js
const BudgetModel = require('../models/budget');

// Récupérer tous les budgets de l'utilisateur pour un mois donné
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query; // Format: YYYY-MM-DD (le premier du mois)
    
    if (!month) {
      return res.status(400).json({ message: 'Paramètre month requis' });
    }

    const budgets = await BudgetModel.findByUserIdAndMonth(userId, month);
    res.json({ budgets });
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau budget
exports.createBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, month } = req.body;

    if (!category_id || !amount || !month) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const budget = await BudgetModel.create({
      user_id: userId,
      category_id,
      amount: parseFloat(amount),
      month
    });

    res.status(201).json({ message: 'Budget créé', budget });
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un budget
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = parseInt(req.params.id);
    const { amount } = req.body;

    const budget = await BudgetModel.update(budgetId, userId, { amount });
    if (!budget) {
      return res.status(404).json({ message: 'Budget non trouvé' });
    }

    res.json({ message: 'Budget mis à jour', budget });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = parseInt(req.params.id);

    const deleted = await BudgetModel.delete(budgetId, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Budget non trouvé' });
    }

    res.json({ message: 'Budget supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};