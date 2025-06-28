const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const { listingSchemaJoi } = require("../schema") //server side validation
const { isLoggedIn, validateListing, isOwner } = require("../middleware") //to find if user is logged in or not owner aithene permission evvu
const multer = require("multer") //multi part form ni parse cheyadaniki
const {storage} = require("../cloudConfig")
const upload = multer({storage}) //files extract from form chesi uploads ane folder lo save chey

const listingController = require("../controllers/listingController")


router.route("/")
    .get(wrapAsync(listingController.index)) //home route
    .post(isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)) //create route -- saving to Db

//create route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(
        isLoggedIn,
        isOwner, //owner aihtene delete chese permission isthunam
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    //delete or destroy route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router