const express=require("express");

const User = require("../models/user.js");


//signup route
module.exports.signup =  (req, res) => {
    res.render('signup.ejs');
};
//signup post route
module.exports.signupPost = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to the app!");
      res.redirect('/listings');
    });

  } catch (err) {
    if (err.name === 'UserExistsError') {
      req.flash('error', 'Username already exists. Please choose another one.');
      return res.redirect('/signup');
    }
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};
//logout route
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect('/listings');
    });
};                                                        
