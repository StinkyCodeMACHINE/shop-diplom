const express = require("express");
const router = new express.Router();
const { getInstances } = require("../controllers/infoController");

router.get("/", getInstances);

module.exports = router;
