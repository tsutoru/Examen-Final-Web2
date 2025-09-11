import express from 'express';
import { getCategories, createCategory } from '../../controllers/categoryController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCategories);
router.post('/', createCategory);

export default router;
