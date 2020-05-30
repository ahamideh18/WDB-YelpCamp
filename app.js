require('dotenv').config()

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index")

const password = process.env.PASS
const connectionString = `mongodb+srv://aham:${password}@main-cluster-zlfxa.azure.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(connectionString, { useNewUrlParser: true }); //Replace with /*"mongodb://localhost/yelp_camp"*/ for local hosting
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())
    //dseedDB();

app.use(require("express-session")({ //client-sessions is an alternative
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes);

app.get("*", function(req, res) {
    res.render('landing');
})

app.get("/", function(req, res) {
    res.render('landing');
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("server has started")
});