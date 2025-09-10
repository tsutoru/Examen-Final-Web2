import { useEffect, useState } from "react";
import api from "../../service/api";
import "./Budget.css";

function Budget() {
  const [budget, setBudget] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    description: ""
  });
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les données du budget
        const budgetData = await api.getBudget();
        setBudget(budgetData || []);
        
        // Charger les transactions
        const transactionsData = await api.getTransactions();
        setTransactions(transactionsData?.transactions || []);
        
        // Calculer les revenus et dépenses
        calculateIncomeAndExpenses(transactionsData?.transactions || []);
        
        // Charger les objectifs d'épargne
        const goalsData = await api.getSavingsGoals();
        setSavingsGoals(goalsData || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };
    
    fetchData();
  }, []);

  const calculateIncomeAndExpenses = (transactions: any[]) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === "revenu") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    
    setIncome(totalIncome);
    setExpenses(totalExpenses);
  };

  const handleAddBudget = async () => {
    const amount = parseFloat(newBudget.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez entrer un montant valide et positif");
      return;
    }
    
    if (!newBudget.category) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }
    
    try {
      // Appel API pour créer un nouveau budget
      await api.createBudget({
        category: newBudget.category,
        amount: amount,
        description: newBudget.description
      });
      
      // Recharger les données
      const budgetData = await api.getBudget();
      setBudget(budgetData || []);
      
      // Réinitialiser le formulaire
      setNewBudget({
        category: "",
        amount: "",
        description: ""
      });
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget", error);
      alert("Erreur lors de l'ajout du budget");
    }
  };

  return (
    <div className={`budget-container ${darkMode ? "budget-dark" : ""}`}>
      {/* Modal pour ajouter un nouveau budget */}
      {showModal && (
        <div className="budget-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="budget-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="budget-modal-header">
              <h3>Ajouter un nouveau budget</h3>
              <button 
                className="budget-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="budget-modal-body">
              <div className="form-group">
                <label>Catégorie</label>
                <select 
                  value={newBudget.category} 
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Alimentation">Alimentation</option>
                  <option value="Transport">Transport</option>
                  <option value="Logement">Logement</option>
                  <option value="Loisirs">Loisirs</option>
                  <option value="Santé">Santé</option>
                  <option value="Épargne">Épargne</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Montant (Ar)</label>
                <input
                  type="number"
                  placeholder="Entrez le montant"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>Description (optionnel)</label>
                <input
                  type="text"
                  placeholder="Description du budget"
                  value={newBudget.description}
                  onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="budget-modal-footer">
              <button 
                className="budget-modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button 
                className="budget-modal-confirm"
                onClick={handleAddBudget}
              >
                Ajouter le budget
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="budget-content">
        {/* --- HEADER --- */}
        <header className="budget-header">
          <div className="budget-header-content">
            <div className="budget-title-container">
              <div className="budget-icon">💰</div>
              <div>
                <h2 className="budget-title">Mon Budget</h2>
                <p className="budget-subtitle">Vue générale de vos finances</p>
              </div>
            </div>
            <div className="budget-header-actions">
              <button
                className="budget-dark-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button 
                className="budget-new-btn"
                onClick={() => setShowModal(true)}
              >
                + Nouveau <span className="budget-btn-arrow">→</span>
              </button>
            </div>
          </div>
        </header>

        {/* --- TABS --- */}
        <nav className="budget-tabs">
          <button className="budget-tab budget-tab-active">Aperçu</button>
          <button className="budget-tab">Statistiques</button>
          <button className="budget-tab">Catégories</button>
          <button className="budget-tab">Transactions</button>
        </nav>

        {/* --- STATS --- */}
        <section className="budget-stats">
          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-green">📈</div>
              <span className="budget-stat-title">Revenus</span>
            </div>
            <p className="budget-stat-amount">{income.toLocaleString()} Ar</p>
            <div className="budget-stat-change">
              <span className="budget-change-text">Total des revenus</span>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-red">💸</div>
              <span className="budget-stat-title">Dépenses</span>
            </div>
            <p className="budget-stat-amount">{expenses.toLocaleString()} Ar</p>
            <div className="budget-stat-change">
              <span className="budget-change-text">Total des dépenses</span>
            </div>
          </div>
        </section>

        {/* --- CHARTS + CATEGORIES --- */}
        <section className="budget-chart-section">
          <div className="budget-chart-container">
            <div className="budget-chart-header">
              <h3 className="budget-chart-title">Graphique des finances</h3>
              <select className="budget-chart-select">
                <option>Mensuel</option>
                <option>Annuel</option>
              </select>
            </div>
            <div className="budget-chart-placeholder">
              <span className="budget-chart-text">
                {income > 0 || expenses > 0 
                  ? "Graphique des finances" 
                  : "Aucune donnée financière"}
              </span>
            </div>
          </div>

          <div className="budget-categories">
            <h3 className="budget-categories-title">Catégories de budget</h3>
            <div className="budget-categories-list">
              {budget.length === 0 ? (
                <p>Aucun budget défini</p>
              ) : (
                budget.map((b: any) => (
                  <div key={b.id} className="budget-category-item">
                    <div className="budget-category-header">
                      <span className="budget-category-name">{b.category}</span>
                      <span className="budget-category-amount">{b.amount.toLocaleString()} Ar</span>
                    </div>
                    <div className="budget-category-progress">
                      <div
                        className="budget-category-progress-bar budget-progress-green"
                        style={{ width: `${Math.min(100, (b.spent || 0) / b.amount * 100)}%` }}
                      ></div>
                    </div>
                    <div className="budget-category-spent">
                      Dépensé: {(b.spent || 0).toLocaleString()} Ar / {b.amount.toLocaleString()} Ar
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* --- TRANSACTIONS --- */}
        <section className="budget-transactions">
          <div className="budget-transactions-header">
            <h3 className="budget-transactions-title">Dernières transactions</h3>
            <a href="#" className="budget-view-all">Voir tout</a>
          </div>
          <div className="budget-transactions-list">
            {transactions.length === 0 ? (
              <p>Aucune transaction récente</p>
            ) : (
              transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="budget-transaction">
                  <div className="budget-transaction-info">
                    <div className={`budget-transaction-icon ${
                      transaction.type === "revenu" 
                        ? "budget-transaction-income" 
                        : "budget-transaction-expense"
                    }`}>
                      {transaction.type === "revenu" ? "💵" : "🛒"}
                    </div>
                    <div className="budget-transaction-details">
                      <span className="budget-transaction-name">{transaction.description}</span>
                      <span className="budget-transaction-meta">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`budget-transaction-amount ${
                    transaction.type === "revenu" 
                      ? "budget-transaction-positive" 
                      : "budget-transaction-negative"
                  }`}>
                    {transaction.type === "revenu" ? "+ " : "- "}
                    {transaction.amount.toLocaleString()} Ar
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* --- OBJECTIFS D'ÉPARGNE --- */}
        <section className="budget-goals">
          <h3 className="budget-goals-title">Objectifs d'épargne</h3>
          <div className="budget-goals-list">
            {savingsGoals.length === 0 ? (
              <p>Aucun objectif d'épargne défini</p>
            ) : (
              savingsGoals.map((goal: any) => (
                <div key={goal.id} className="budget-goal">
                  <div className="budget-goal-info">
                    <span className="budget-goal-name">{goal.name}</span>
                    <span className="budget-goal-target">
                      Objectif: {goal.targetAmount.toLocaleString()} Ar
                    </span>
                  </div>
                  <div className="budget-goal-progress">
                    <div className="budget-goal-progress-bar">
                      <div
                        className="budget-goal-progress-fill"
                        style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="budget-goal-amount">
                      {goal.currentAmount.toLocaleString()} Ar économisés
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Budget;