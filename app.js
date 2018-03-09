/*============
   YELPCAMP 
=============*/

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    nodeGeocoder    = require("node-geocoder");
    
var Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    seedDB              = require("./seeds"),
    User                = require("./models/user"),
    campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index"),
    userRoutes          = require("./routes/users");

//initial setup
require("dotenv").config();
// mongoose.connect("mongodb://localhost/yelpcamp");
mongoose.connect("mongodb://kchou94:yelpcamppudding@ds261838.mlab.com:61838/yelpcamp-kchou94");
app.set("view engine", "ejs");
app.locals.moment = require("moment");

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "do not forget to flush the toilet",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//geocoder
var geocoderOptions = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GOOGLE_MAPS_API_KEY
};
var geocoder = nodeGeocoder(geocoderOptions);

//locals
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/users", userRoutes);

//seed
// seedDB();

/*============
  LISTENER
============*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp app server start...");
})

