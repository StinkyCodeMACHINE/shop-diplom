const express = require("express");
const router = new express.Router();
const { create, getAll, getInfo } = require("../controllers/typeController");
const checkRole = require("../middleware/checkRole");

router.get("/", getAll);
router.get("/:id", getInfo);
router.post("/", checkRole("ADMIN"), create);

module.exports = router;
