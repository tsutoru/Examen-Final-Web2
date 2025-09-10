import { useEffect, useState } from "react";
import api from "../../service/api";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "./Budget.css";

// Enregistrer les composants de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Budget() {
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [budget, setBudget] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les transactions
        const transactionsData = await api.getTransactions();
        setTransactions(transactionsData?.transactions || []);
        
        // Charger les catégories
        const categoriesData = await api.getCategories();
        setCategories(categoriesData?.categories || []);
        
        // Calculer le budget basé sur les transactions
        calculateBudget(transactionsData?.transactions || []);
        
        // Charger les objectifs d'épargne
        const goalsData = await api.getSavings();
        setSavingsGoals(goalsData?.savings || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };
    
    fetchData();
  }, []);

  // Fonction pour calculer correctement le budget (revenus - dépenses)
  const calculateBudget = (transactions: any[]) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === "revenu") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "depense") {
        totalExpenses += transaction.amount;
      }
    });
    
    const calculatedBudget = totalIncome - totalExpenses;
    setBudget(calculatedBudget);
  };

  // Préparer les données pour le graphique circulaire (revenus + dépenses)
  const prepareDoughnutChartData = () => {
    // Regrouper par type (revenu/dépense) et par catégorie
    const dataByTypeAndCategory: {[key: string]: number} = {};
    
    transactions.forEach(transaction => {
      const category = categories.find((c) => c.id === transaction.category_id);
      const categoryName = category ? category.name : "Non catégorisé";
      const key = `${transaction.type}-${categoryName}`;
      
      dataByTypeAndCategory[key] = (dataByTypeAndCategory[key] || 0) + transaction.amount;
    });
    
    // Séparer les labels et les données
    const labels = Object.keys(dataByTypeAndCategory).map(key => {
      const [type, category] = key.split('-');
      return `${category} (${type === 'revenu' ? 'Revenu' : 'Dépense'})`;
    });
    
    const data = Object.values(dataByTypeAndCategory);
    
    // Couleurs différentes pour revenus et dépenses
    const backgroundColors = Object.keys(dataByTypeAndCategory).map(key => {
      return key.startsWith('revenu-') ? '#4CAF50' : '#F44336';
    });
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const doughnutChartData = prepareDoughnutChartData();

  // Préparer les données pour le graphique en barres de l'évolution du budget
  const prepareBarChartData = () => {
    // Grouper les transactions par mois
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === "revenu") {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expense += transaction.amount;
      }
    });
    
    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(label => monthlyData[label].income);
    const expenseData = labels.map(label => monthlyData[label].expense);
    
    return {
      labels,
      datasets: [
        {
          label: 'Revenus',
          data: incomeData,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Dépenses',
          data: expenseData,
          backgroundColor: '#F44336',
        },
      ],
    };
  };

  const barChartData = prepareBarChartData();

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des revenus et dépenses',
      },
    },
  };

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour exporter le graphique en PNG
  const exportChartAsPNG = (chartId: string, filename: string) => {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (chartCanvas) {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = chartCanvas.toDataURL('image/png');
      link.click();
    }
  };

  // Calculer les totaux pour l'affichage
  const totalIncome = transactions
    .filter(t => t.type === "revenu")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "depense")
    .reduce((sum, t) => sum + t.amount, 0);

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
            </div>
          </div>
        </header>

        {/* --- BUDGET DISPLAY --- */}
        <section className="budget-stats">
          <div className="budget-stat-card budget-main-card">
            <div className="budget-stat-header">
              <div className={`budget-stat-icon ${budget >= 0 ? "budget-bg-green" : "budget-bg-red"}`}>
                {budget >= 0 ? "💰" : "⚠️"}
              </div>
              <span className="budget-stat-title">Budget Actuel</span>
            </div>
            <p className={`budget-stat-amount ${budget >= 0 ? "budget-positive" : "budget-negative"}`}>
              {formatAmount(budget)} Ar
            </p>
            <div className="budget-stat-change">
              <span className="budget-change-text">
                {budget >= 0 ? "Solde positif" : "Solde négatif"}
              </span>
            </div>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-green">
                📈
              </div>
              <span className="budget-stat-title">Total Revenus</span>
            </div>
            <p className="budget-stat-amount budget-positive">
              {formatAmount(totalIncome)} Ar
            </p>
          </div>

          <div className="budget-stat-card">
            <div className="budget-stat-header">
              <div className="budget-stat-icon budget-bg-red">
                📉
              </div>
              <span className="budget-stat-title">Total Dépenses</span>
            </div>
            <p className="budget-stat-amount budget-negative">
              {formatAmount(totalExpenses)} Ar
            </p>
          </div>
        </section>

        {/* --- CHARTS --- */}
        <section className="budget-chart-section">
          <div className="budget-chart-container">
            <div className="budget-chart-header">
              <h3 className="budget-chart-title">Répartition des revenus et dépenses</h3>
              <button 
                className="budget-export-btn"
                onClick={() => exportChartAsPNG('doughnut-chart', 'repartition-budget')}
              >
                📥 Exporter
              </button>
            </div>
            <div className="budget-chart">
              {transactions.length > 0 ? (
                <Doughnut 
                  data={doughnutChartData} 
                  id="doughnut-chart"
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <p className="budget-no-data">Aucune transaction enregistrée</p>
              )}
            </div>
          </div>

          <div className="budget-chart-container">
            <div className="budget-chart-header">
              <h3 className="budget-chart-title">Évolution du budget</h3>
              <select 
                className="budget-chart-select"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
            <div className="budget-chart">
              {transactions.length > 0 ? (
                <Bar 
                  data={barChartData} 
                  options={barChartOptions}
                  id="bar-chart"
                />
              ) : (
                <p className="budget-no-data">Aucune transaction enregistrée</p>
              )}
            </div>
          </div>
        </section>

        {/* --- TRANSACTIONS --- */}
        <section className="budget-transactions">
          <div className="budget-transactions-header">
            <h3 className="budget-transactions-title">Dernières transactions</h3>
          </div>
          <div className="budget-transactions-list">
            {transactions.length === 0 ? (
              <p className="budget-no-data">Aucune transaction récente</p>
            ) : (
              transactions.slice(0, 5).map((transaction) => {
                const category = categories.find(c => c.id === transaction.category_id);
                return (
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
                        <span className="budget-transaction-name">
                          {transaction.description || "Sans description"}
                        </span>
                        <span className="budget-transaction-meta">
                          {category ? category.name : "Non catégorisé"} • {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`budget-transaction-amount ${
                      transaction.type === "revenu" 
                        ? "budget-transaction-positive" 
                        : "budget-transaction-negative"
                    }`}>
                      {transaction.type === "revenu" ? "+ " : "- "}
                      {formatAmount(transaction.amount)} Ar
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* --- OBJECTIFS D'ÉPARGNE --- */}
        <section className="budget-goals">
          <h3 className="budget-goals-title">Objectifs d'épargne</h3>
          <div className="budget-goals-list">
            {savingsGoals.length === 0 ? (
              <p className="budget-no-data">Aucun objectif d'épargne défini</p>
            ) : (
              savingsGoals.map((goal: any) => (
                <div key={goal.id} className="budget-goal">
                  <div className="budget-goal-info">
                    <span className="budget-goal-name">{goal.name}</span>
                    <span className="budget-goal-target">
                      Objectif: {formatAmount(goal.target_amount)} Ar
                    </span>
                  </div>
                  <div className="budget-goal-progress">
                    <div className="budget-goal-progress-bar">
                      <div
                        className="budget-goal-progress-fill"
                        style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="budget-goal-amount">
                      {formatAmount(goal.current_amount)} Ar économisés
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