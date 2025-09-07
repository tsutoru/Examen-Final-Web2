import { useState } from "react";
import Banner from "./components/Banner/Banner";
import ExpenseTracker from "./components/ExpenseTracker/ExpenseTracker";
import Budget from "./components/budget/budget";
import RapportFinanciers from "./components/Financies/RapportFinanciers";
import './App.css'

function App() {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [activeView, setActiveView] = useState("transactions");

  const handleLogin = (name: string) => {
    setUsername(name);
    localStorage.setItem("username", name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  const renderView = () => {
    switch (activeView) {
      case "transactions":
        return <ExpenseTracker />;
      case "budget":
        return <Budget />;
      case "rapport":
        return <RapportFinanciers />;
      default:
        return <ExpenseTracker />;
    }
  };

  return (
    <div className="App">
      {!username ? (
        <Banner onLogin={handleLogin} />
      ) : (
        <>
          <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Gestion des Finances</h1>
            <div className="flex items-center gap-4">
              <span>Bienvenue, {username} 👋</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Déconnexion
              </button>
            </div>
          </header>

          <nav className="flex justify-center gap-4 p-4 bg-gray-200">
            <button
              onClick={() => setActiveView("transactions")}
              className={`px-4 py-2 rounded ${
                activeView === "transactions"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveView("budget")}
              className={`px-4 py-2 rounded ${
                activeView === "budget" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveView("rapport")}
              className={`px-4 py-2 rounded ${
                activeView === "rapport" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              Rapports
            </button>
          </nav>

          <main className="p-6">{renderView()}</main>
        </>
      )}
    </div>
  );
}

export default App;
