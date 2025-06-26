const Listing = require("./models/listing")
const { listingSchemaJoi } = require("./schema") //server side validation
const ExpressError = require("./utils/expressError") //error class ki
const { reviewSchemaJoi } = require("./schema") //server side validation 

const isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) { 
        //sstoring redirect detail such that after login we can show where he wanted to so and not only listings page
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "Login to create a Listing")
        return res.redirect("/login")
    }
    next()
}
const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}
const isOwner = async (req,res,next) =>{
        //only owner ithene edit or delete cheyali adhi check chesthunam!

        let { id } = req.params
        let listing = await Listing.findById(id)
        if(!listing.owner.equals(res.locals.currentUser._id)){
            req.flash("error","You aren't the owner so you can edit or Delete")
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

module.exports = { isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview }
