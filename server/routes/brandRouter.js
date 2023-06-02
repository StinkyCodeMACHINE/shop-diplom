const express = require("express");
const router = new express.Router();
const {
  create,
  getAll,
  changeBrand,
  deleteBrand,
} = require("../controllers/brandController");
const checkRole = require("../middleware/checkRole");

router.get("/", getAll);
router.post("/", checkRole("ADMIN"), create);
router.put("/:id", checkRole("ADMIN"), changeBrand);
router.delete("/:id", checkRole("ADMIN"), deleteBrand);

module.exports = router;
