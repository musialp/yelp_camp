var bodyParser      = require("body-parser"),
    flash           = require("connect-flash");
    express         = require("express"),
    expressSession  = require("express-session"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  =require("method-override")

var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    User        = require("./models/user");

var commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

var app = express();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use(expressSession({
    secret: "Lol. C'mon!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// seedDB();

app.listen(3000, function() {
    console.log("Server is running");
})