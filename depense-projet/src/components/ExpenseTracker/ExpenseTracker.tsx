import { useEffect, useState } from "react";
import api from "../../service/api";

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

  return (
    <div>
      <h2>Mes Transactions</h2>
      <div>
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTransaction}>Ajouter</button>
      </div>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.date} - {t.type} - {t.amount} ({t.description})
            <button onClick={() => deleteTransaction(t.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;
