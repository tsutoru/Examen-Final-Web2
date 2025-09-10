// database/seedCategories.js
const pool = require('../config/database');

const defaultCategories = [
  // Revenus
  { name: 'Salaire', type: 'revenu', color: '#4CAF50', icon: 'cash' },
  { name: 'Prime', type: 'revenu', color: '#8BC34A', icon: 'gift' },
  { name: 'Investissement', type: 'revenu', color: '#CDDC39', icon: 'trending-up' },
  
  // Dépenses
  { name: 'Nourriture', type: 'depense', color: '#FF5722', icon: 'food' },
  { name: 'Logement', type: 'depense', color: '#795548', icon: 'home' },
  { name: 'Transport', type: 'depense', color: '#2196F3', icon: 'car' },
  { name: 'Loisirs', type: 'depense', color: '#E91E63', icon: 'gamepad' },
  { name: 'Santé', type: 'depense', color: '#9C27B0', icon: 'heart' },
  { name: 'Éducation', type: 'depense', color: '#3F51B5', icon: 'book' },
  { name: 'Shopping', type: 'depense', color: '#FF9800', icon: 'shopping' },
  { name: 'Autre', type: 'depense', color: '#9E9E9E', icon: 'help-circle' }
];

async function seedCategories() {
  try {
    // Récupérer tous les utilisateurs
    const users = await pool.query('SELECT id FROM users');
    
    for (const user of users.rows) {
      for (const category of defaultCategories) {
        // Vérifier si la catégorie existe déjà
        const existing = await pool.query(
          'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3',
          [user.id, category.name, category.type]
        );
        
        if (existing.rows.length === 0) {
          // Insérer la catégorie
          await pool.query(
            'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5)',
            [user.id, category.name, category.type, category.color, category.icon]
          );
        }
      }
    }
    
    console.log('Catégories par défaut créées avec succès');
  } catch (error) {
    console.error('Erreur lors de la création des catégories par défaut:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedCategories().then(() => process.exit());
}

module.exports = seedCategories;