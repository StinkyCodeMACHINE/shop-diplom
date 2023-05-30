const express = require("express");
const router = new express.Router();
const {
  create,
  getAll,
  getOne,
  leaveReview,
  getReviews,
  getReview,
  countReviews,
  rateReview,
  getReviewRatings,
  deleteReviewRating,
} = require("../controllers/productController");
const checkRole = require("../middleware/checkRole");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkRole("ADMIN"), create);
router.post("/:id/review", checkAuth, leaveReview);
router.post("/:id/review/rate/:reviewId", checkAuth, rateReview);
router.get("/", getAll);
router.get("/:id/review", getReviews);
router.get("/:id/review/rate/", checkAuth, getReviewRatings);
router.get("/:id/review/count", countReviews);
router.get("/:id/review/check", checkAuth, getReview);
router.get("/:id", getOne);
router.delete("/:id/review/rate/:reviewId", checkAuth, deleteReviewRating);

module.exports = router;
