import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/User';

const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validation simple
    if (!email || !password || !name) {
      res.status(400).json({ message: 'Tous les champs sont requis' });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      return;
    }

    // Créer le nouvel utilisateur
    const user = await UserModel.create({ email, password, name });

    // Générer le token JWT
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

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe requis' });
      return;
    }

    // Trouver l'utilisateur
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    // Vérifier le mot de passe
    const validPassword = await UserModel.verifyPassword(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer le token JWT
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