var express = require("express"),
    router  = express.Router();

var User        = require("../models/user"),
    Campground  = require("../models/campground");
    
//SHOW
router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, userFound){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Campground.find().where("author.id").equals(userFound.id).exec(function(err, campgroundsFound){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            res.render("users/show", {userPublic: userFound, campgrounds: campgroundsFound});
        });
    });
});

module.exports = router;