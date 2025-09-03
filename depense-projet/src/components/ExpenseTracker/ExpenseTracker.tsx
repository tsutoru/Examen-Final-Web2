import React, { useState } from 'react';
import './ExpenseTracker.css';

interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
}

const ExpenseTracker: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, title: 'Courses', amount: 85, category: 'Alimentation', date: '2023-10-15' },
        { id: 2, title: 'Essence', amount: 45, category: 'Transport', date: '2023-10-14' },
        { id: 3, title: 'Cinéma', amount: 25, category: 'Loisirs', date: '2023-10-13' },
        { id: 4, title: 'Loyer', amount: 650, category: 'Logement', date: '2023-10-05' },
        { id: 5, title: 'Internet', amount: 40, category: 'Services', date: '2023-10-10' }
    ]);

    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: 'Alimentation',
        date: new Date().toISOString().split('T')[0]
    });

    const categories = ['Alimentation', 'Transport', 'Loisirs', 'Logement', 'Services', 'Santé', 'Autre'];

    const addExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpense.title || !newExpense.amount) return;

        const expense: Expense = {
            id: Date.now(),
            title: newExpense.title,
            amount: parseFloat(newExpense.amount),
            category: newExpense.category,
            date: newExpense.date
        };

        setExpenses([...expenses, expense]);
        setNewExpense({
            title: '',
            amount: '',
            category: 'Alimentation',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const deleteExpense = (id: number) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

    const categoryTotals = categories.map(category => ({
        category,
        total: expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0)
    }));

    const maxCategoryTotal = Math.max(...categoryTotals.map(item => item.total));

    return (
        <div className="expense-tracker">
            <div className="expense-header">
                <h2>Expense Tracker</h2>
                <div className="total-amount">Total: €{totalExpenses.toFixed(2)}</div>
            </div>

            <div className="expense-content">
                <div className="expense-form">
                    <h3>Ajouter une Dépense</h3>
                    <form onSubmit={addExpense}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newExpense.title}
                                onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Montant (€)"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                required
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="date"
                                value={newExpense.date}
                                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="add-btn">Ajouter</button>
                    </form>
                </div>

                <div className="expense-chart">
                    <h3>Répartition des Dépenses</h3>
                    <div className="chart-bars">
                        {categoryTotals.map((item, index) => (
                            <div key={item.category} className="chart-item">
                                <div className="chart-bar-container">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            height: maxCategoryTotal > 0 ? `${(item.total / maxCategoryTotal) * 100}%` : '0%',
                                            backgroundColor: index % 2 === 0 ? '#116466' : '#D9B08C'
                                        }}
                                    ></div>
                                </div>
                                <div className="chart-label">
                                    <span>{item.category}</span>
                                    <span>€{item.total.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="expense-list">
                <h3>Dernières Dépenses</h3>
                <div className="expenses">
                    {expenses.slice().reverse().map(expense => (
                        <div key={expense.id} className="expense-item">
                            <div className="expense-info">
                                <div className="expense-title">{expense.title}</div>
                                <div className="expense-category">{expense.category}</div>
                                <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                            </div>
                            <div className="expense-amount">
                                €{expense.amount.toFixed(2)}
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="delete-btn"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;