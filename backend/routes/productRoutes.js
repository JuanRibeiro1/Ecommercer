const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', productController.list);
router.get('/:id', productController.getOne);

// rotas admin
router.post('/', authMiddleware, requireAdmin, upload.single('image'), productController.create);
router.put('/:id', authMiddleware, requireAdmin, upload.single('image'), productController.update);
router.delete('/:id', authMiddleware, requireAdmin, productController.remove);

module.exports = router;
