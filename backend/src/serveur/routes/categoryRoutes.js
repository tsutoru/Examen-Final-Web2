// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryControllers');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getCategories);
router.post('/', createCategory);

module.exports = router;