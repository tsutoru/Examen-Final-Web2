import { useEffect, useState } from "react";
import api from "../../service/api";

function RapportFinanciers() {
  const [categories, setCategories] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSaving, setNewSaving] = useState("");

  const loadData = async () => {
    const cats = await api.getCategories();
    setCategories(cats.categories || []);

    const sav = await api.getSavings();
    setSavings(sav.savings || []);
  };

  const addCategory = async () => {
    await api.createCategory({ name: newCategory, color: "#ff0000" });
    setNewCategory("");
    await loadData();
  };

  const addSaving = async () => {
    await api.createSaving({ name: newSaving, target_amount: 1000 });
    setNewSaving("");
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>Rapports Financiers</h2>

      <h3>Catégories</h3>
      <input
        type="text"
        placeholder="Nom catégorie"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={addCategory}>Ajouter</button>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <h3>Épargne</h3>
      <input
        type="text"
        placeholder="Nom épargne"
        value={newSaving}
        onChange={(e) => setNewSaving(e.target.value)}
      />
      <button onClick={addSaving}>Ajouter</button>
      <ul>
        {savings.map((s) => (
          <li key={s.id}>{s.name} - objectif: {s.target_amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default RapportFinanciers;
