const Listing = require("./models/listing")
const { listingSchemaJoi } = require("./schema") //server side validation
const ExpressError = require("./utils/expressError") //error class ki
const { reviewSchemaJoi } = require("./schema") //server side validation 
const Review = require("./models/review")

const isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) { 
        //sstoring redirect detail such that after login we can show where he wanted to so and not only listings page
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "Please Login to Continue")
        return res.redirect("/login")
    }
    next()
}
const saveRedirectUrl = (req,res,next)=>{ //user ye url ki podham anukunado adhi save chesthunam! check userRoute to understand
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}
const isOwner = async (req,res,next) =>{
        //only owner ithene edit or delete cheyali adhi check chesthunam! listing ki

        let { id } = req.params
        let listing = await Listing.findById(id)
        if (!listing) {
            req.flash("error", "Listing not found!")
            return res.redirect("/listings")
        }
        if(!listing.owner.equals(res.locals.currentUser._id)){
            req.flash("error","You aren't the owner so you cant edit or Delete")
            return res.redirect(`/listings/${id}`)
        }
        next()
}
const isReviewAuthor = async (req,res,next) =>{
        //only author ithene delete cheyali adhi check chesthunam! review ki

        let { id, reviewId } = req.params
        let review = await Review.findById(reviewId)
        if (!review) {
            req.flash("error", "Review not found!")
            return res.redirect(`/listings/${id}`)
        }
        if (!res.locals.currentUser) {
            req.flash("error", "Please Login to Continue");
            return res.redirect("/login");
        }
        if(!review.author.equals(res.locals.currentUser._id)){
            req.flash("error","You aren't the author of this Review,so you cant Delete")
            return res.redirect(`/listings/${id}`)
        }
        next()
}


//this is to throw error if there is a problem with joi in listing
const validateListing = (req, res, next) => {
    let { error } = listingSchemaJoi.validate(req.body) //server side validate chesthunam using joi complete body ni aaa file lo listing undha ani check chesthunam!
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

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

module.exports = { isLoggedIn,saveRedirectUrl,
    isOwner,validateListing,validateReview,
    isReviewAuthor
 }
