import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Étendre l'interface Request pour inclure la propriété user
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user; // Ajouter les informations utilisateur à la requête
    next(); // Passer au prochain middleware
  });
};