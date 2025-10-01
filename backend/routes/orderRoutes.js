const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/my", authMiddleware, orderController.getMyOrders);
router.get("/", authMiddleware, requireAdmin, orderController.getAllOrders);

module.exports = router;