var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

//INDEX Route
router.get("/campgrounds", function(req,res){
    //WE WANT TO GET CAMPGROUNDS FROM THE DATABASE
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds})
        }
    })
    //res.render("campgrounds", {campgrounds:campgrounds});
})

//CREATE route
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, price: price, description: description, author: author};
    //CREATE NEW CAMP AND SAVE TO DB
    Campground.create(newCampground, function(err, newCreation){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/campgrounds");  //Redirect default is as a get request
        }
    })
})

//NEW route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//SHOW route
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }
        else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

//EDIT route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
})

//UPDATE route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DELETE route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground deleted")
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;

