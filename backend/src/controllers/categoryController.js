// controllers/categoryControllers.js
const CategoryModel = require('../models/category');

// Récupérer toutes les catégories de l'utilisateur
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await CategoryModel.findByUserId(userId);
    res.json({ categories });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Nom et type requis' });
    }

    const category = await CategoryModel.create({
      user_id: userId,
      name,
      type,
      color: color || '#000000',
      icon: icon || 'help-circle'
    });

    res.status(201).json({ message: 'Catégorie créée', category });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};