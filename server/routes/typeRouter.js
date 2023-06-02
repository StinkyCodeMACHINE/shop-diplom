const express = require("express");
const router = new express.Router();
const {
  create,
  getAll,
  getInfo,
  changeType,
  deleteType,
} = require("../controllers/typeController");
const checkRole = require("../middleware/checkRole");

router.get("/", getAll);
router.get("/:id", getInfo);
router.post("/", checkRole("ADMIN"), create);
router.put("/:id", checkRole("ADMIN"), changeType);
router.delete("/:id", checkRole("ADMIN"), deleteType);

module.exports = router;
