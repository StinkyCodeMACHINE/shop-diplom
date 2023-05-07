const express = require("express");
const router = new express.Router();
const {create, getAll} = require("../controllers/typeController")
const checkRole = require('../middleware/checkRoleMiddleWare')

router.get("/", getAll);
router.post("/", checkRole('ADMIN'), create);

module.exports = router;
