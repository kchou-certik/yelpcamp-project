var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //is user logged in?
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", "Campground not found :(");
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id) || req.user.isAdmin){ //user = author of campground?
                    next();
                } else {
                    req.flash("error", "Sorry, you don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must log in before doing this.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //is user logged in?
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", "Comment not found :(");
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin){ //user = author of comment?
                    next();
                } else {
                    req.flash("error", "Sorry, you don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must log in before doing this.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must log in before doing this.");
    res.redirect("/login");
}

module.exports = middlewareObj;