import React, { useState } from 'react';
import './Banner.css';

interface BannerProps {
    onLogin: (username: string, semester: string) => void;
}

const Banner: React.FC<BannerProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        semester: '',
        rememberMe: false
    });
    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
        semester: '',
        agreeToTerms: false
    });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginData.username && loginData.password) {
            onLogin(loginData.username, loginData.semester);
        }
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (signupData.fullName && signupData.email && signupData.newPassword) {
            onLogin(signupData.fullName, signupData.semester);
        }
    };

    const handleLoginChange = (field: keyof typeof loginData, value: string | boolean) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignupChange = (field: keyof typeof signupData, value: string | boolean) => {
        setSignupData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="banner-container">
            <div className="banner-wrapper">
                <div className={`banner ${activeTab === 'signup' ? 'signup-active' : ''}`}>
                    <div className="login-section">
                        <div className="section-content">
                            <h2>Connexion</h2>
                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={loginData.username}
                                        onChange={(e) => handleLoginChange('username', e.target.value)}
                                        placeholder="Nom d'utilisateur"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => handleLoginChange('password', e.target.value)}
                                        placeholder="Mot de passe"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={loginData.semester}
                                        onChange={(e) => handleLoginChange('semester', e.target.value)}
                                        placeholder="Semestre №"
                                    />
                                </div>
                                <div className="remember">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={loginData.rememberMe}
                                            onChange={(e) => handleLoginChange('rememberMe', e.target.checked)}
                                        />
                                        Se souvenir de moi
                                    </label>
                                </div>
                                <button type="submit" className="submit-btn">Se connecter</button>
                            </form>
                            <p className="switch-text">
                                Pas de compte? <span onClick={() => setActiveTab('signup')}>S'inscrire</span>
                            </p>
                        </div>
                    </div>
                    <div className="signup-section">
                        <div className="section-content">
                            <h2>Inscription</h2>
                            <form onSubmit={handleSignupSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={signupData.fullName}
                                        onChange={(e) => handleSignupChange('fullName', e.target.value)}
                                        placeholder="Nom complet"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={signupData.email}
                                        onChange={(e) => handleSignupChange('email', e.target.value)}
                                        placeholder="Adresse email"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={signupData.newPassword}
                                        onChange={(e) => handleSignupChange('newPassword', e.target.value)}
                                        placeholder="Nouveau mot de passe"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={signupData.confirmPassword}
                                        onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                                        placeholder="Confirmer le mot de passe"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={signupData.semester}
                                        onChange={(e) => handleSignupChange('semester', e.target.value)}
                                        placeholder="Semestre №"
                                    />
                                </div>
                                <div className="remember">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={signupData.agreeToTerms}
                                            onChange={(e) => handleSignupChange('agreeToTerms', e.target.checked)}
                                            required
                                        />
                                        J'accepte les conditions d'utilisation
                                    </label>
                                </div>
                                <button type="submit" className="submit-btn">S'inscrire</button>
                            </form>
                            <p className="switch-text">
                                Déjà un compte? <span onClick={() => setActiveTab('login')}>Se connecter</span>
                            </p>
                        </div>
                    </div>
                    <div className="oblique-divider"></div>
                </div>
            </div>
        </div>
    );
};

export default Banner;