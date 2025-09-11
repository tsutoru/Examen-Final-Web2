// controllers/categoryControllers.js
import CategoryModel from '../models/category.js';

// Récupérer toutes les catégories de l'utilisateur
export const getCategories = async (req, res) => {
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
export const createCategory = async (req, res) => {
  console.log('➡️ Données reçues :', req.body); // 🔍 Ajout du log
  try {
    const userId = req.user.id;
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Nom et type requis' });
    }

    const category = await CategoryModel.create({
      user_id: userId,
      name_categorie: name,
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