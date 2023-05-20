const express = require("express");
const router = new express.Router();
const { create, getAll } = require("../controllers/groupController");
const checkRole = require("../middleware/checkRole");

router.get("/", getAll);
router.post("/", checkRole("ADMIN"), create);

module.exports = router;
