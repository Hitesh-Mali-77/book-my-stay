const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//REVIEWS
// POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateReview,
  WrapAsync(reviewController.createReview)
);

// DELETE REVIEWS ROUTE
router.delete("/:reviewId", WrapAsync(reviewController.destroyReview));

module.exports = router;
