var express         = require("express"),
    router          = express.Router(),
    nodeGeocoder    = require("node-geocoder");
    
var Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//geocoder
var geocoderOptions = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GOOGLE_MAPS_API_KEY
};
var geocoder = nodeGeocoder(geocoderOptions);

//INDEX - show campgrounds
router.get("/", function(req, res){
    //Get campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            return console.log(err);
        }
        res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
    });
});

//CREATE - adds new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        var lat = data[0].latitidue;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var campgroundNew = {
            name: name,
            price: price,
            image: image,
            description: description,
            author: author,
            location: location,
            lat: lat,
            lng: lng
        };
        //create new campground & save to db
        Campground.create(campgroundNew, function(err, campgroundCreated){
            if(err){
                return console.log(err);
            }
            console.log(campgroundCreated);
            res.redirect("/campgrounds");
        });
    });
});

//NEW - the form for new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - view info about specific :id campground
router.get("/:id", function(req, res){
    // find ID campground based on URL :id
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            return console.log(err);
        }
        res.render("campgrounds/show", {campground: campground});          
    });
    //render ID campground page
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground});
    });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    var campgroundData = req.body.campground;
    geocoder.geocode(campgroundData.location, function(err, data){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        campgroundData.lat = data[0].latitude;
        campgroundData.lng = data[0].longitude;
        campgroundData.location = data[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, {$set: campgroundData}, function(err, campgroundUpdated){
            if(err){
                req.flash("error", err.message);
                return res.redirect("/campgrounds");
            }
            console.log(campgroundUpdated);
            req.flash("success", "Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        });
    });
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            return res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

module.exports = router;