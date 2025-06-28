const User = require("../models/user")

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup")
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
  res.render("users/login")
}

module.exports.login = async (req, res, next) => { //actual login is done by passport.authenticate
  req.flash("success","Welcome Back to Wanderlust")
  let redirectUrl = res.locals.redirectUrl || "/listings" //if nrml ga manam login avthe isLoggedIn trigger avvadhu such that ee variable use avvadhu undefined store avthundhi sso anduke nrml ga define chesam
  // console.log(req.user) //after authentication passport directly saves userinfo in req as req.user
  res.redirect(redirectUrl)
}

module.exports.logOut = (req,res,next)=>{
  req.logout((err)=>{
      if(err){
         return next(err)
      }else{
          req.flash("success","You are Logged Out Successfully!")
          res.redirect("/listings")
      }

  })
}