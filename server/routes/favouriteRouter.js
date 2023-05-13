const express = require("express");
const router = new express.Router();
const {
  addToFavourite,
  removeFromFavourite,
  getFavouriteProducts,
  getFavouriteId
} = require("../controllers/productController");
const checkAuth = require("../middleware/authMiddleware");

router.get("/:id", checkAuth, getFavouriteId);
router.post("/product/:id", checkAuth, addToFavourite);
router.delete("/product/:id", checkAuth, removeFromFavourite);
router.get("/product/", checkAuth, getFavouriteProducts);


module.exports = router;
