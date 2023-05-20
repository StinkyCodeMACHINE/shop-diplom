const express = require("express");
const router = new express.Router();
const { create, getAll, getOne } = require("../controllers/productController");
const checkRole = require("../middleware/checkRole");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkRole("ADMIN"), create);
router.get("/", getAll);
router.get("/:id", getOne);

module.exports = router;
