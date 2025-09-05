import { useEffect, useState } from "react";
import api from "../../service/api"; // ✅ attention: ton dossier est "services" pas "service"
import "./Budget.css";

function Budget() {
  const [budget, setBudget] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const data = await api.getBudget?.();
        setBudget(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch du budget", error);
      }
    };
    fetchBudget();
  }, []);

  return (
    <div className={`budget-container ${darkMode ? "budget-dark" : ""}`}>
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
              <button className="budget-new-btn">
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
            <p className="budget-stat-amount">1 200 000 Ar</p>
            <div className="budget-stat-change">
              <span className="budget-change-badge budget-change-positive">+8%</span>
              <span className="budget-change-text">par rapport au mois dernier</span>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-red">💸</div>
              <span className="budget-stat-title">Dépenses</span>
            </div>
            <p className="budget-stat-amount">850 000 Ar</p>
            <div className="budget-stat-change">
              <span className="budget-change-badge budget-change-negative">-5%</span>
              <span className="budget-change-text">par rapport au mois dernier</span>
            </div>
          </div>
        </section>

        {/* --- CHARTS + CATEGORIES --- */}
        <section className="budget-chart-section">
          <div className="budget-chart-container">
            <div className="budget-chart-header">
              <h3 className="budget-chart-title">Graphique des revenus</h3>
              <select className="budget-chart-select">
                <option>Mensuel</option>
                <option>Annuel</option>
              </select>
            </div>
            <div className="budget-chart-placeholder">
              <span className="budget-chart-text">[Graphique ici]</span>
            </div>
          </div>

          <div className="budget-categories">
            <h3 className="budget-categories-title">Catégories</h3>
            <div className="budget-categories-list">
              {budget.length === 0 ? (
                <p>Aucune catégorie définie</p>
              ) : (
                budget.map((b: any) => (
                  <div key={b.id} className="budget-category-item">
                    <div className="budget-category-header">
                      <span className="budget-category-name">{b.category}</span>
                      <span className="budget-category-amount">{b.amount} Ar</span>
                    </div>
                    <div className="budget-category-progress">
                      <div
                        className="budget-category-progress-bar budget-progress-green"
                        style={{ width: `${Math.min(100, b.amount / 10000)}%` }}
                      ></div>
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
            <div className="budget-transaction">
              <div className="budget-transaction-info">
                <div className="budget-transaction-icon budget-transaction-income">💵</div>
                <div className="budget-transaction-details">
                  <span className="budget-transaction-name">Salaire</span>
                  <span className="budget-transaction-meta">1er Septembre</span>
                </div>
              </div>
              <span className="budget-transaction-amount budget-transaction-positive">
                + 500 000 Ar
              </span>
            </div>
            <div className="budget-transaction">
              <div className="budget-transaction-info">
                <div className="budget-transaction-icon budget-transaction-expense">🛒</div>
                <div className="budget-transaction-details">
                  <span className="budget-transaction-name">Courses</span>
                  <span className="budget-transaction-meta">3 Septembre</span>
                </div>
              </div>
              <span className="budget-transaction-amount budget-transaction-negative">
                - 120 000 Ar
              </span>
            </div>
          </div>
        </section>

        {/* --- OBJECTIFS D'ÉPARGNE --- */}
        <section className="budget-goals">
          <h3 className="budget-goals-title">Objectifs d'épargne</h3>
          <div className="budget-goals-list">
            <div className="budget-goal">
              <div className="budget-goal-info">
                <span className="budget-goal-name">Vacances</span>
                <span className="budget-goal-target">1 000 000 Ar</span>
              </div>
              <div className="budget-goal-progress">
                <div className="budget-goal-progress-bar">
                  <div
                    className="budget-goal-progress-fill"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <span className="budget-goal-amount">400 000 Ar économisés</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Budget;
