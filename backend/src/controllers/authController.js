import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js'; // Assure-toi que UserModel est en JS aussi

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Tous les champs sont requis' });
      return;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      return;
    }

    const user = await UserModel.create({ email, password, name });
    const token = generateToken(user);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe requis' });
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const validPassword = await UserModel.verifyPassword(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
