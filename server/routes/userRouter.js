const express = require("express");
const router = new express.Router();
const {
  registration,
  login,
  activateAccount,
  check,
  test,
} = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.get("/auth", checkAuth, check);
// router.get("/activation/:link", activateAccount);
router.get("/activation/:link", activateAccount);

router.post("/registration", registration);
router.post("/login", login);

module.exports = router;
