const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/:id', authMiddleware, cartController.removeItem);

module.exports = router;
