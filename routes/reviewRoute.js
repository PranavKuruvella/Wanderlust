const express = require("express")
const router = express.Router({mergeParams: true}) //app.js nunchi unna motham url pampu ani ardham
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const Review = require("../models/review") //review schema
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware")

const reviewController = require("../controllers/reviewController")


//review Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//delete each review for each listing
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router