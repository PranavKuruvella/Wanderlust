const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const { listingSchemaJoi } = require("../schema") //server side validation
const {isLoggedIn,validateListing,isOwner} = require("../middleware") //to find if user is logged in or not
 //owner aithene permission evvu

const listingController = require("../controllers/listingController")

//home route
router.get("/", wrapAsync(listingController.index))

//create route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//show route
router.get("/:id", wrapAsync(listingController.showListing))

//create route -- saving to Db
router.post("/", validateListing, wrapAsync(listingController.createListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

//update route
router.put("/:id",
    isLoggedIn,
    isOwner, //owner aihtene delete chese permission isthunam
    validateListing,
    wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

module.exports = router