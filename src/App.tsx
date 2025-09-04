import { useState } from "react";
import Banner from './components/Banner/Banner';
import ExpenseTracker from './components/ExpenseTracker/ExpenseTracker';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import Budget from "./components/budget/budget";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({ username: '', semester: '' });
    const [activeView, setActiveView] = useState('expense');

    const handleLogin = (username: string, semester: string) => {
        setIsLoggedIn(true);
        setUser({ username, semester });
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser({ username: '', semester: '' });
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'expense':
                return <ExpenseTracker />;
            case 'budget':
                return <Budget />;
            case 'reports':
                return <div className="view-content"><h2>Rapports Financiers</h2><p>Fonctionnalité à venir...</p></div>;
            case 'settings':
                return <div className="view-content"><h2>Paramètres</h2><p>Fonctionnalité à venir...</p></div>;
            default:
                return <ExpenseTracker />;
        }
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                <Banner onLogin={handleLogin} />
            ) : (
                <div className="app-container">
                    <Navbar activeView={activeView} onViewChange={setActiveView} />

                    <main className="main-content">
                        <header className="app-header">
                            <div className="user-info">
                                <h2>Bienvenue, {user.username}!</h2>
                                <p>Semestre: {user.semester}</p>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                Déconnexion
                            </button>
                        </header>

                        {renderActiveView()}
                    </main>
                </div>
            )}
        </div>
    );
}

export default App;