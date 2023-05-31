const express = require("express");
const router = new express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, getOrders);
router.post("/", checkAuth, createOrder);

module.exports = router;
