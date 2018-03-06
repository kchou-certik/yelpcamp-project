var express = require("express"),
    router  = express.Router(),
    passport= require("passport");
    
var User    = require("../models/user");

/*==========
 ROOT ROUTE
===========*/

//ROOT - redirect to index
router.get("/", function(req, res){
    res.render("landing");
});

/*==============
  AUTH ROUTES
==============*/

//REGISTER FORM
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

//REGISTER LOGIC
router.post("/register", function(req, res){
    var userNew = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    var adminCode = req.body.adminCode;
    if(adminCode){
        if(adminCode === "bubbletea"){
            userNew.isAdmin = true;
        } else {
            req.flash("error", "Incorrect admin code!");
            return res.redirect("/register");
        }
    }
    User.register(userNew, req.body.password, function(err, userRegistered){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + userRegistered.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back!"
}));

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out.  Thanks for stopping by!");
    res.redirect("/campgrounds");
});

module.exports = router;