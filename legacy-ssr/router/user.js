const express = require("express");
const router = express.Router({mergeParams:true});
const user = require("../model/user");
const customerror = require("../utils/expressError");
const passport = require("passport");
const {isLogedIn} = require("../middleware");
require('dotenv').config();
router.get("/signup", (req,res) => {
    res.render("signup");
})

router.post("/signup",async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    let newuser = new user({
        username:username,
        email:email,
    });
    let register_user = await user.register(newuser,password);
    console.log(register_user);
    req.logIn(register_user,(err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "SignUp successfull");
        res.redirect("/listing");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    };
});

router.get("/login",(req,res)=>{
    res.render("login");
})

router.post("/login",
    passport.authenticate('local', {failureRedirect:'/login', failureFlash:true, successFlash:"welcome bacK"}),
    (req,res)=>{
        req.flash("success" , "login successfull"),
        res.redirect("/Listing");
    }
);

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","logout succesfull !"); 
        res.redirect("/listing");
        
    });
});

module.exports = router;