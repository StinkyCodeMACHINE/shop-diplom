const express = require("express");
const router = new express.Router();
const {
  registration,
  login,
  activateAccount,
  check,
  changeProfile,
  getUserInfo,
} = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.post("/registration", registration);
router.post("/login", login);

router.get("/auth", checkAuth, check);
router.get("/one", checkAuth, getUserInfo);
router.get("/activation/:link", activateAccount);
router.put("/", checkAuth, changeProfile)



module.exports = router;
