const express = require("express");
const router = new express.Router();
const {
  getBanners,
  createBanner,
  deleteBanner,
  changeBanner,
} = require("../controllers/bannerController");
const checkRole = require("../middleware/checkRole");

router.get("/", getBanners);
router.post("/", checkRole("ADMIN"), createBanner);
router.put("/:id", checkRole("ADMIN"), changeBanner);
router.delete("/:id", checkRole("ADMIN"), deleteBanner);

module.exports = router;
