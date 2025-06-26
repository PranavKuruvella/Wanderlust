const express = require("express")
const router = express.Router({mergeParams: true}) //app.js nunchi unna motham url pampu ani ardham
const Listing = require("../models/listing") //listing model
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const ExpressError = require("../utils/expressError") //error class ki
const { reviewSchemaJoi } = require("../schema") //server side validation 
const Review = require("../models/review") //review schema


//this is to throw error if there is a problem with joi in review
const validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoi.validate(req.body) //server side validate chesthunam using joi complete body ni aaa file lo listing undha ani check chesthunam!
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


//review Post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing) {
        throw new ExpressError(404, "Listing not found")
    }
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview) //listing li reivews ane array lo push chesthunam!
    await newReview.save()
    await listing.save()
    
    req.flash("success","New Review Created!")
    // res.redirect(`/listings/${listing._id}`) //idhaina raskochu
    res.redirect(`/listings/${id}`)
}))

//delete each review for each listing
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //this pulls aka deletes the reviewId inside the reviews Array of that particular listing
    await Review.findByIdAndDelete(reviewId) //this just deletes from review collection but not in listing array
    req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`)
}))


module.exports = router