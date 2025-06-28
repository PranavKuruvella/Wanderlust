const express = require("express")
const router = express.Router() //app.js nunchi unna motham url pampu ani ardham
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware") //saves the original url where user wanted to go such that after login we can redirect the same page

const userController = require("../controllers/userController")

//create route
router.get("/signup", userController.renderSignUp)

//saving to DB - from create route
router.post("/signup", wrapAsync(userController.signup))

//login route
router.get("/login", userController.renderLogin)

//checking inorder to login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local", { //automatic ga username password teskoni adhe check chesthundhi with our DB
        // local - basic kadha mandhi or google tho na alla..
        // failureRedirect: "/login" -- fail aithe eekadaki po
        // failureFlash: true -- fail aithe flash chupinchu automatic ga manam cretae cheyalisindhi akarledhu password ee chesthundhi flash messages
        failureRedirect: "/login", failureFlash: true
    }),
    userController.login)

//logOut route
router.get("/logout",userController.logOut)

module.exports = router