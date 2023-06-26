const express = require("express");
const router = new express.Router();
const {
  createOrder,
  getOrders,
  getAllOrders,
  setToDelivering,
  setToDelivered,
  deleteOrder,
  cancelOrder,
} = require("../controllers/orderController");
const checkAuth = require("../middleware/checkAuth");
const checkRole = require("../middleware/checkRole")

router.get("/", checkAuth, getOrders);
router.get("/all/", checkRole("ADMIN"), getAllOrders);
router.put("/:id/delivering", checkRole("ADMIN"), setToDelivering);
router.put("/:id/delivered", checkRole("ADMIN"), setToDelivered);
router.delete("/:id", checkRole("ADMIN"), deleteOrder);
router.delete("/:id/cancel", checkAuth, cancelOrder);
router.post("/", checkAuth, createOrder);

module.exports = router;
