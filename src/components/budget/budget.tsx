import React, { useState } from "react";
import "./Budget.css";

// Types pour nos données
interface Transaction {
  id: number;
  name: string;
  amount: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const Budget: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);

  // Données des transactions
  const transactions: Transaction[] = [
    { id: 1, name: "Courses", amount: "-85,60 €", category: "Alimentation", date: "Aujourd'hui", type: 'expense' },
    { id: 2, name: "Salaire", amount: "+2 200,00 €", category: "Revenu", date: "Hier", type: 'income' },
    { id: 3, name: "Abonnement Spotify", amount: "-9,99 €", category: "Divertissement", date: "22 Oct", type: 'expense' },
    { id: 4, name: "Restaurant", amount: "-42,50 €", category: "Sortie", date: "20 Oct", type: 'expense' },
    { id: 5, name: "Freelance", amount: "+850,00 €", category: "Revenu", date: "18 Oct", type: 'income' }
  ];

  // Catégories de budget
  const budgetCategories: BudgetCategory[] = [
    { id: 1, name: "Logement", allocated: 1000, spent: 850, color: "#6366f1" },
    { id: 2, name: "Alimentation", allocated: 400, spent: 320, color: "#10b981" },
    { id: 3, name: "Transport", allocated: 200, spent: 180, color: "#f59e0b" },
    { id: 4, name: "Loisirs", allocated: 300, spent: 270, color: "#ec4899" },
    { id: 5, name: "Épargne", allocated: 500, spent: 500, color: "#8b5cf6" }
  ];

  return (
    <div className={`budget-container ${darkMode ? 'budget-dark' : ''}`}>
      <div className="budget-content">
        
        {/* HEADER AVEC BOUTON MODE SOMBRE */}
        <div className="budget-header">
          <div className="budget-header-content">
            <div className="budget-title-container">
              <div className="budget-icon">
                <span>💰</span>
              </div>
              <div>
                <h1 className="budget-title">Gestion du Budget</h1>
                <p className="budget-subtitle">Maîtrisez vos finances avec élégance</p>
              </div>
            </div>
            <div className="budget-header-actions">
              <button 
                className="budget-dark-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button className="budget-new-btn">
                <span>+</span>
                Nouveau Budget
                <span className="budget-btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION PAR ONGLETS */}
        <div className="budget-tabs">
          {["Aperçu", "Dépenses", "Revenus", "Analytiques", "Catégories"].map((tab) => (
            <button
              key={tab}
              className={`budget-tab ${activeTab === tab.toLowerCase() ? 'budget-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* STATISTIQUES PRINCIPALES */}
        <div className="budget-stats">
          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-indigo">
                <span>🎯</span>
              </div>
              <h3 className="budget-stat-title">Budget Total</h3>
            </div>
            <div>
              <p className="budget-stat-amount budget-text-indigo">3 200 €</p>
              <div className="budget-stat-change">
                <span className="budget-change-badge budget-change-positive">+8%</span>
                <span className="budget-change-text">ce mois-ci</span>
              </div>
            </div>
            <div className="budget-stat-progress">
              <div className="budget-progress-bar budget-progress-indigo" style={{width: '85%'}}></div>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-green">
                <span>📈</span>
              </div>
              <h3 className="budget-stat-title">Revenus</h3>
            </div>
            <div>
              <p className="budget-stat-amount budget-text-green">2 850 €</p>
              <div className="budget-stat-change">
                <span className="budget-change-badge budget-change-positive">+12%</span>
                <span className="budget-change-text">vs mois précédent</span>
              </div>
            </div>
            <div className="budget-stat-progress">
              <div className="budget-progress-bar budget-progress-green" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-red">
                <span>📉</span>
              </div>
              <h3 className="budget-stat-title">Dépenses</h3>
            </div>
            <div>
              <p className="budget-stat-amount budget-text-red">2 180 €</p>
              <div className="budget-stat-change">
                <span className="budget-change-badge budget-change-negative">-5%</span>
                <span className="budget-change-text">vs mois précédent</span>
              </div>
            </div>
            <div className="budget-stat-progress">
              <div className="budget-progress-bar budget-progress-red" style={{width: '65%'}}></div>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-purple">
                <span>🏦</span>
              </div>
              <h3 className="budget-stat-title">Épargne</h3>
            </div>
            <div>
              <p className="budget-stat-amount budget-text-purple">670 €</p>
              <div className="budget-stat-change">
                <span className="budget-change-text">Objectif: 800 €</span>
              </div>
            </div>
            <div className="budget-stat-progress">
              <div className="budget-progress-bar budget-progress-purple" style={{width: '83.75%'}}></div>
            </div>
          </div>
        </div>

        {/* GRAPHIQUE ET RÉPARTITION */}
        <div className="budget-chart-section">
          <div className="budget-chart-container">
            <div className="budget-chart-header">
              <h2 className="budget-chart-title">Évolution des finances</h2>
              <select className="budget-chart-select">
                <option>Mensuel</option>
                <option>Trimestriel</option>
                <option>Annuel</option>
              </select>
            </div>
            
            <div className="budget-chart-placeholder">
              <p className="budget-chart-text">Visualisation graphique ici</p>
            </div>
          </div>

          <div className="budget-categories">
            <h2 className="budget-categories-title">Répartition du budget</h2>
            <div className="budget-categories-list">
              {budgetCategories.map(category => (
                <div key={category.id} className="budget-category-item">
                  <div className="budget-category-header">
                    <h3 className="budget-category-name">{category.name}</h3>
                    <span className="budget-category-amount">{category.spent} / {category.allocated} €</span>
                  </div>
                  <div className="budget-category-progress">
                    <div 
                      className="budget-category-progress-bar" 
                      style={{
                        width: `${(category.spent / category.allocated) * 100}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DERNIÈRES TRANSACTIONS */}
        <div className="budget-transactions">
          <div className="budget-transactions-header">
            <h2 className="budget-transactions-title">Dernières transactions</h2>
            <button className="budget-view-all">Tout voir →</button>
          </div>
          
          <div className="budget-transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="budget-transaction">
                <div className="budget-transaction-info">
                  <div className={`budget-transaction-icon ${transaction.type === 'income' ? 'budget-transaction-income' : 'budget-transaction-expense'}`}>
                    <span>{transaction.type === 'income' ? '⬆️' : '⬇️'}</span>
                  </div>
                  <div className="budget-transaction-details">
                    <p className="budget-transaction-name">{transaction.name}</p>
                    <p className="budget-transaction-meta">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <p className={`budget-transaction-amount ${transaction.type === 'income' ? 'budget-transaction-positive' : 'budget-transaction-negative'}`}>
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* OBJECTIFS D'ÉPARGNE */}
        <div className="budget-goals">
          <h2 className="budget-goals-title">Objectifs d'épargne</h2>
          <div className="budget-goals-list">
            <div className="budget-goal">
              <div className="budget-goal-info">
                <h3 className="budget-goal-name">Vacances d'été</h3>
                <p className="budget-goal-target">Objectif: 1500 €</p>
              </div>
              <div className="budget-goal-progress">
                <div className="budget-goal-progress-bar">
                  <div className="budget-goal-progress-fill" style={{width: '45%'}}></div>
                </div>
                <p className="budget-goal-amount">675 € épargnés</p>
              </div>
            </div>
            <div className="budget-goal">
              <div className="budget-goal-info">
                <h3 className="budget-goal-name">Nouveau véhicule</h3>
                <p className="budget-goal-target">Objectif: 8000 €</p>
              </div>
              <div className="budget-goal-progress">
                <div className="budget-goal-progress-bar">
                  <div className="budget-goal-progress-fill" style={{width: '20%'}}></div>
                </div>
                <p className="budget-goal-amount">1600 € épargnés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;