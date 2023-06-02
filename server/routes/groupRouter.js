const express = require("express");
const router = new express.Router();
const {
  create,
  getAll,
  deleteGroup,
  changeGroup,
} = require("../controllers/groupController");
const checkRole = require("../middleware/checkRole");

router.post("/", checkRole("ADMIN"), create);
router.get("/", getAll);
router.put("/:id", checkRole("ADMIN"), changeGroup);
router.delete("/:id", checkRole("ADMIN"), deleteGroup);

module.exports = router;
