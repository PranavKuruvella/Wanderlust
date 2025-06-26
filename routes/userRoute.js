const express = require("express")
const router = express.Router() //app.js nunchi unna motham url pampu ani ardham
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync") //error handling ki
const ExpressError = require("../utils/expressError") //error class ki
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware") //saves the original url where user wanted to go such that after login we can redirect the same page

//create route
router.get("/signup", (req, res) => {
    res.render("users/signup")
})
//saving to DB - from create route
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password)
        req.login(registeredUser,(err)=>{ //signup chesthe malla login cheyakarledhu
            if(err){
                return next(err)
            }else{
            req.flash("success", "Welcome to Wanderlust") //direct ga show route ki use avthundhi
            return res.redirect("/listings")
            }
        })
    } catch (err) {
        req.flash("error", err.message)
        return res.redirect("/signup")
    }
}))

//login route
router.get("/login", (req, res) => {
    res.render("users/login")

})
//checking inorder to login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local", { //automatic ga username password teskoni adhe check chesthundhi with our DB
        // local - basic kadha mandhi or google tho na alla..
        // failureRedirect: "/login" -- fail aithe eekadaki po
        // failureFlash: true -- fail aithe flash chupinchu automatic ga manam cretae cheyalisindhi akarledhu password ee chesthundhi flash messages
        failureRedirect: "/login", failureFlash: true
    }),
    async (req, res) => {
        req.flash("success","Welcome Back to Wanderlust")
        let redirectUrl = res.locals.redirectUrl || "/listings" //if nrml ga manam login avthe isLoggedIn trigger avvadhu such that ee variable use avvadhu undefined store avthundhi sso anduke nrml ga define chesam
        // console.log(req.user) //after authentication passport directly saves userinfo in req as req.user
        res.redirect(redirectUrl)
    })

router.get("/logout",(req,res,next)=>{
        req.logout((err)=>{
            if(err){
               return next(err)
            }else{
                req.flash("success","You are Logged Out Successfully!")
                res.redirect("/listings")
            }

        })
    })

module.exports = router