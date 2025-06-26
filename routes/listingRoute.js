const express = require("express")
const router = express.Router()
const Listing = require("../models/listing") //listing model
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const { listingSchemaJoi } = require("../schema") //server side validation
const ExpressError = require("../utils/expressError") //error class ki
const {isLoggedIn,validateListing,isOwner} = require("../middleware") //to find if user is logged in or not
 //owner aithene permission evvu
 //owner aithene permission evvu


//home route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index", { allListings })
}))

//create route
router.get("/new",isLoggedIn,(req, res) => {
    res.render("listings/new")
})

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews").populate("owner") //both review and owner rendu frontend lo chupinchadaniki

    if (!listing){ //lets say listing ni delete chesi malla adhe link ki osthe lisiting ledhu ani chepi all listing ki redirect chesthunam
        req.flash("error", "Listing Doesn't Exist!")
        return res.redirect("/listings") //if no written both .redirect and .render is called anduke return rayali
    }
    // console.log(listing)
    res.render("listings/show", { listing })
}))

//create route -- saving to Db
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id //saving the respective owner in Db
    await newListing.save()
    req.flash("success", "New Listing Created!") //flash message
    res.redirect("/listings")
}))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing){ //lets say listing ni delete chesi malla adhe link ki osthe lisiting ledhu ani chepi all listing ki redirect chesthunam
        req.flash("error", "Listing Doesn't Exist!")
        return res.redirect("/listings") //if no written both .redirect and .render is called anduke return rayali
    }
    res.render("listings/edit", { listing })
}))

//update route
router.put("/:id",
    isLoggedIn,
    isOwner, //owner aihtene delete chese permission isthunam
    validateListing,
      wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}))

module.exports = router