var express = require("express");
var Campground = require("../models/campground");
var middleware = require("../middleware");

var router = express.Router();

// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("./campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    })
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name, 
        image: image,
        description: description,
        price: price,
        author: author
    };
    Campground.create(newCampground, function(err, newCampground) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("./campgrounds/edit", {campground: foundCampground});
    })
})

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;