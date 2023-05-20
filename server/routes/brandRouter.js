const express = require("express");
const router = new express.Router();
const { create, getAll } = require("../controllers/brandController");
const checkRole = require("../middleware/checkRole");

router.get("/", getAll);
router.post("/", checkRole("ADMIN"), create);

module.exports = router;
