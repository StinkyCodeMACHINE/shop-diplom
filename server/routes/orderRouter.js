const express = require("express");
const router = new express.Router();
const {
  createOrder,
  getOrders,
  getAllOrders,
  changeStatus,
  deleteOrder,
} = require("../controllers/orderController");
const checkAuth = require("../middleware/checkAuth");
const checkRole = require("../middleware/checkRole")

router.get("/", checkAuth, getOrders);
router.get("/all/", checkRole("ADMIN"), getAllOrders);
router.put("/:id", checkRole("ADMIN"), changeStatus);
router.delete("/:id", checkRole("ADMIN"), deleteOrder);
router.post("/", checkAuth, createOrder);

module.exports = router;
