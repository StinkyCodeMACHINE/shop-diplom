const express = require("express");
const router = new express.Router();
const {registration, login, check} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get("/auth", authMiddleware, check);

router.post("/registration", registration);
router.post("/login", login);


module.exports = router;
