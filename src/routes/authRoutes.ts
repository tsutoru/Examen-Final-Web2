import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// POST /api/auth/register - Créer un nouveau compte utilisateur
router.post('/register', register);

// POST /api/auth/login - Connecter un utilisateur
router.post('/login', login);

export default router;