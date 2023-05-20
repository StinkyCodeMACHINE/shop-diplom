const express = require("express");
const router = new express.Router();
const {
  addToFavourite,
  removeFromFavourite,
  getFavouriteProducts,
  getFavouriteIds,
} = require("../controllers/favouriteController");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, getFavouriteIds);
router.post("/product/:id", checkAuth, addToFavourite);
router.delete("/product/:id", checkAuth, removeFromFavourite);
router.get("/product/", checkAuth, getFavouriteProducts);

module.exports = router;
