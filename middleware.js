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

module.exports = { isLoggedIn,saveRedirectUrl }
