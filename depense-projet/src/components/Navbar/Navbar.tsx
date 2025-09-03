import React from 'react';
import './Navbar.css';

interface NavbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
    const menuItems = [
        { id: 'expense', label: 'Dépenses', icon: '💰' },
        { id: 'budget', label: 'Budget', icon: '📊' },
        { id: 'reports', label: 'Rapports', icon: '📈' },
        { id: 'settings', label: 'Paramètres', icon: '⚙️' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-header">
                <div className="logo">💰</div>
                <h3>FinanceApp</h3>
            </div>

            <ul className="navbar-menu">
                {menuItems.map(item => (
                    <li key={item.id} className={activeView === item.id ? 'active' : ''}>
                        <button onClick={() => onViewChange(item.id)} className="nav-item">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="navbar-footer">
                <div className="user-profile">
                    <div className="profile-avatar">👤</div>
                    <div className="profile-info">
                        <span className="profile-name">Utilisateur</span>
                        <span className="profile-status">En ligne</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;