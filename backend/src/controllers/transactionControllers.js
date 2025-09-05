import { TransactionModel } from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await TransactionModel.findByUserId(userId);
    res.json({ transactions });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { account_id, category_id, amount, type, description, date } = req.body;

    if (!account_id || !amount || !type || !date) {
      res.status(400).json({ message: 'Champs requis manquants' });
      return;
    }

    if (type !== 'depense' && type !== 'revenu') {
      res.status(400).json({ message: 'Le type doit être "depense" ou "revenu"' });
      return;
    }

    const transaction = await TransactionModel.create({
      user_id: userId,
      account_id,
      category_id,
      amount: parseFloat(amount),
      type,
      description,
      date: new Date(date)
    });

    res.status(201).json({ message: 'Transaction créée', transaction });
  } catch (error) {
    console.error('Erreur lors de la création de la transaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);

    const transaction = await TransactionModel.findById(transactionId, userId);
    if (!transaction) {
      res.status(404).json({ message: 'Transaction non trouvée' });
      return;
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Erreur lors de la récupération de la transaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    const updates = req.body;

    const transaction = await TransactionModel.update(transactionId, userId, updates);
    if (!transaction) {
      res.status(404).json({ message: 'Transaction non trouvée' });
      return;
    }

    res.json({ message: 'Transaction mise à jour', transaction });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);

    const deleted = await TransactionModel.delete(transactionId, userId);
    if (!deleted) {
      res.status(404).json({ message: 'Transaction non trouvée' });
      return;
    }

    res.json({ message: 'Transaction supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const balance = await TransactionModel.getBalance(userId);
    res.json({ balance });
  } catch (error) {
    console.error('Erreur lors du calcul du solde:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
