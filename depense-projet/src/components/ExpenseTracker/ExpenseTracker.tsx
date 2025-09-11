import { useEffect, useState } from "react";
import api from "../../service/api";
import "./ExpenseTracker.css"; // Import du fichier CSS

function ExpenseTracker() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("depense");
  const [description, setDescription] = useState("");

  const loadTransactions = async () => {
    const data = await api.getTransactions();
    setTransactions(data.transactions || []);
  };

  const addTransaction = async () => {
    console.log({
      account_id: 1,
      amount: parseFloat(amount),
      type,
      description,
      date: new Date(),
    });

    if (!amount) return;
    await api.createTransaction({
      account_id: 1, // à adapter
      amount: parseFloat(amount),
      type,
      description,
      date: new Date(),
    });
    setAmount("");
    setDescription("");
    await loadTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await api.deleteTransaction(id);
    await loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Calcul du solde total
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