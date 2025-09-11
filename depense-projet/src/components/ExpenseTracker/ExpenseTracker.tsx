import { useEffect, useState } from "react";
import api from "../../service/api";
import "./ExpenseTracker.css";

function ExpenseTracker() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("depense");
  const [description, setDescription] = useState("");
  // États pour les nouvelles fonctionnalités
  const [categories, setCategories] = useState<string[]>(["Alimentation", "Transport", "Loisirs"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseType, setExpenseType] = useState<"ponctuelle" | "recurrente">("ponctuelle");
  const [duration, setDuration] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const loadTransactions = async () => {
    const data = await api.getTransactions();
    setTransactions(data.transactions || []);
  };

  const addTransaction = async () => {
    if (!amount) return;

    let finalDescription = description;
    if (type === "depense") {
      finalDescription = `${description} [Catégorie: ${selectedCategory}, Type: ${expenseType}`;
      if (expenseType === "recurrente" && duration) {
        finalDescription += `, Durée: ${duration} mois`;
      }
      finalDescription += "]";
    }

    await api.createTransaction({
      account_id: 1,
      amount: parseFloat(amount),
      type,
      description: finalDescription,
      date: new Date(),
    });
    
    setAmount("");
    setDescription("");
    setSelectedCategory("");
    setExpenseType("ponctuelle");
    setDuration("");
    await loadTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await api.deleteTransaction(id);
    await loadTransactions();
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory("");
    }
  };

  const deleteCategory = (categoryToDelete: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory(categories[0]);
      }
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const totalAmount = transactions.reduce((total, transaction) => {
    return transaction.type === "revenu" 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);

  return (
    <div className="expense-tracker">
      <div className="expense-header">
        <h2>Mes Transactions</h2>
      </div>

      <div className="expense-content">
        <div className="expense-form">
          <h3>Nouvelle Transaction</h3>
          <div className="form-group">
            <input
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="depense">Dépense</option>
              <option value="revenu">Revenu</option>
            </select>
          </div>
          
          {type === "depense" && (
            <>
              <div className="form-group">
                <div className="category-header">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    className="delete-category-btn"
                    onClick={() => deleteCategory(selectedCategory)}
                    disabled={categories.length <= 1}
                  >
                    ×
                  </button>
                </div>
                <div className="add-category">
                  <input
                    type="text"
                    placeholder="Nouvelle catégorie"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button onClick={addCategory}>+</button>
                </div>
              </div>

              <div className="form-group">
                <select 
                  value={expenseType} 
                  onChange={(e) => setExpenseType(e.target.value as "ponctuelle" | "recurrente")}
                >
                  <option value="ponctuelle">Dépense ponctuelle</option>
                  <option value="recurrente">Dépense prolongée</option>
                </select>
              </div>

              {expenseType === "recurrente" && (
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Durée en mois (optionnel)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={addTransaction}>Ajouter</button>
        </div>
      </div>

      <div className="expense-list">
        <h3>Historique des Transactions</h3>
        {transactions.map((t) => (
          <div key={t.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-title">{t.description || "Sans description"}</div>
              <div className="expense-category">{t.type}</div>
              <div className="expense-date">
                {new Date(t.date).toLocaleDateString()}
              </div>
            </div>
            <div className="expense-amount">
              {t.type === "depense" ? "-" : "+"}
              {t.amount} €
              <button 
                className="delete-btn"
                onClick={() => deleteTransaction(t.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseTracker;