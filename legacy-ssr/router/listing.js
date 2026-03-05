const express = require("express");
const router = express.Router();
exports.router = router;
var flash = require('express-flash');
const WrapAsync = require("../utils/wrapAsync");
const Review = require("../model/review.js");
const listing = require("../router/listing.js");
const listmodel = require("../model/schema");
const customerror = require("../utils/expressError.js");
const {joischema} = require("../joi.js");
const { app } = require("../app.js");
var session = require('express-session')
const passport = require("passport");
const LocalStrategy =  require("passport-local");
const User = require("../model/user.js");
const {isLogedIn} = require("../middleware.js");
const listingcontrol = require("../controllers/listing.js");
const reviewcontrol = require("../controllers/review.js");
const multer = require('multer');
const {storage} = require("../cloud.js");
const wrapAsync = require("../utils/wrapAsync");
const upload = multer({ storage});
require('dotenv').config();
const Booking = require("../model/booking.js");


app.use(flash());
app.use(session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie:{
        maxAge : 7*24*60*60*100,
        expires:Date.now()+7*24*60*60*100,
        httpOnly:true,
      }
}));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success =  req.flash("success");
    res.locals.error =  req.flash("error"); 
    res.locals.currentuser = req.user;
    next();
})


let validate = function(req,res,next){
    let {error} = joischema.validate(req.body);
        if(error){
            throw new customerror(6969,error);
        }
        else{
            next();
        }
}


router.get("/new",isLogedIn,listingcontrol.render);

router.route("/")
.get(WrapAsync(listingcontrol.read))
.post( upload.single('listing[image]'),isLogedIn, WrapAsync(listingcontrol.create));

router.route("/details/:id")
.put(isLogedIn ,upload.single('listing[image]'), WrapAsync(listingcontrol.update))
.get(WrapAsync(listingcontrol.details));

//booking
router.post("/details/:id/booking",isLogedIn,wrapAsync((async(req,res,next) => {
    const {id:listingId } = req.params;
    console.log(listingId);
    const { checkIn, checkOut, guests } = req.body;
    const conflicting = await Booking.findOne({
    listing: listingId,
    $or: [
        { checkIn: { $lt: checkOut, $gte: checkIn } },
        { checkOut: { $gt: checkIn, $lte: checkOut } },
        { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } }
    ]
    });

    if (conflicting) {
    req.flash("error", "This listing is already booked during those dates.");
    console.log("conflict this")
    console.log(listingId);
    return res.redirect(`/listing/details/${listingId}`);
    
    }else{
    const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        checkIn,
        checkOut,
        guests
    });
    console.log(booking);
    await booking.save();
    req.flash('success', 'Booking successful!');
    console.log("not conflict")
    res.render("bookingdone",{listingId});
    
    }})));

//delete
router.delete("/delete/:id", WrapAsync(listingcontrol.delete));

//revcreate
router.post("/details/:id/review",isLogedIn,WrapAsync(reviewcontrol.create));

//revdelete
router.delete("/delete/:id/review/:revid",isLogedIn, WrapAsync(reviewcontrol.delete));

router.get("/search",wrapAsync(listingcontrol.search));

router.get("/edit/:id",isLogedIn, WrapAsync(async(req,res) => {
    let {id} = req.params;
    listing_data = await listmodel.findById(id);
    console.log(listing_data);
    res.render("edit.ejs",{id,listing_data});
}));

module.exports = router;