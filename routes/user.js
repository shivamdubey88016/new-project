const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const {savedRedirectUrl} = require("../middleware.js")
const userController = require("../controller/user.js");
const passport = require("passport");


router.get('/signup',userController.signup);

router.post('/signup', userController.signupPost);
//login route
router.get('/login', (req, res) => {
    res.render('login.ejs');
});
router.post('/login', 
    savedRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Login successful");
        res.redirect(res.locals.redirectUrl || '/listings');
    }
);

// routes/user.js

//logout route
router.get('/logout',userController.logout);
module.exports=router; 