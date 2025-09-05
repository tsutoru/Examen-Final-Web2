import { useState } from "react";
import api from "../../service/api";  // ⚠️ ton dossier est "services" pas "service"
import "./Banner.css";

interface BannerProps {
  onLogin: (username: string) => void;
}

function Banner({ onLogin }: BannerProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let data;
      if (isRegister) {
        data = await api.register(email, password, name);
      } else {
        data = await api.login(email, password);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin(data.user.name);
      } else {
        setError(data.message || "Erreur");
      }
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="banner-container">
      <div className={`banner ${isRegister ? "signup-active" : ""}`}>
        
        {/* Section login */}
        <div className="login-section">
          <div className="section-content">
            <h2>Se connecter</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Se connecter</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p className="switch-text">
              Pas encore de compte ?{" "}
              <span onClick={() => setIsRegister(true)}>Inscrivez-vous</span>
            </p>
          </div>
        </div>

        {/* Section inscription */}
        <div className="signup-section">
          <div className="section-content">
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">S'inscrire</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p className="switch-text">
              Déjà un compte ?{" "}
              <span onClick={() => setIsRegister(false)}>Connectez-vous</span>
            </p>
          </div>
        </div>

        {/* Séparateur oblique */}
        <div className="oblique-divider"></div>
      </div>
    </div>
  );
}

export default Banner;
