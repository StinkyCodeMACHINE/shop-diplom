const express = require("express");
const router = new express.Router();
const {create, addToFavourite, getAll, getOne} = require('../controllers/productController')
const checkRole = require("../middleware/checkRoleMiddleWare");
const checkAuth = require("../middleware/authMiddleware")

router.post("/", checkRole('ADMIN'), create);
router.post("/:id", checkAuth, addToFavourite);
router.get("/", getAll);
router.get("/:id", getOne);


module.exports = router;
