if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/expressError") //error class ki
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport") //for auth and author
const LocalStrategy = require("passport-local")
const User = require("./models/user")


const listingRoute = require("./routes/listingRoute")
const reviewRoute = require("./routes/reviewRoute")
const userRoute = require("./routes/userRoute")


async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}
main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log("MongoDB connection error:", err)
})

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "public")))


const sessionOptions = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, //one week
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}

//root route
// app.get("/", (req, res) => {
//     res.send("HI I AM ROOT")
// })

app.use(session(sessionOptions)) //using sessions
app.use(flash())

app.use(passport.initialize()) //initilize passport
app.use(passport.session()) //passport will access session to verify user is same in different tabs or not and same acc on different tabs undadaniki kuda chsuthndhi
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) //storing info of user in session
passport.deserializeUser(User.deserializeUser()) // deleting stored info of user in session after completing session


//taking and storing flash messages from server and then shared to respective ejs temp and is used there
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user //used to only show signup or login or logout in nav and also to show only edit and delete option if he is the owner
    next()
})


//listings and review route
app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)

// 404 handler for any other route
// app.use("*", (req, res, next) => {
//     const err = new ExpressError(404,"Page not found");
//     next(err);
// });


// error middleware
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something Went Wrong!" } = err
    //res.status(statuscode).send(message)
    res.render("listings/error", { statuscode, message })
})

app.listen(8080, () => {
    console.log("server is listening")
})

