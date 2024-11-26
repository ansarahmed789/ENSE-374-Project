const express = require("express");
require('dotenv').config(); // Load .env variables

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
const userRoutes = require("./Controller/userController"); // Import the routes
const PORT = 3000;

const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/medilocate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy setup
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ username: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize and deserialize users
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    // medicalId: String // Optional for non-medical users
});

// Create and export the User model
// const User = mongoose.model("User", userSchema);
const User = require("./Model/userModel"); // Import the User model (adjust the path as needed)

module.exports = User;

app.set('view engine', 'ejs');

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the public directory

// Route for the root path
app.get("/", (req, res) => {
    res.render("Login", { email: '' });
});

  app.get("/results", (req, res) => {
    const city = req.query.city.toLowerCase();
    const clinics = clinicsData[city] || [];
    res.render("results", { cityName: city.charAt(0).toUpperCase() + city.slice(1), clinics });
  });

 // Route for login page
app.get("/Login", (req, res) => {
    res.render("Login", { email: '' }); // Serve Login page
    console.log("A user requested the Login page");
});

// Route for signup page
app.get("/Signup", (req, res) => {
    res.render("Signup", { name: '', email: '' }); // Serve Signup page
    console.log("A user requested the Signup page");
});

// Route for home page
app.get("/Home", (req, res) => {
    res.render("home"); // Serve home.ejs
    console.log("User authenticated, serving the Home page");
});
// Route for MyAppointments page
app.get("/MyAppointments", (req, res) => {
    res.render("myAppointments", { appointments: '' }); // Serve home.ejs
    console.log("User authenticated, serving the Home page");
});

app.get("/SignupMedical", (req, res) => {
    res.render("SignupMedical", { name: '', email: '' , medicalId:''}); // Serve Signup Medical page
    console.log("User authenticated, serving the Signup page");
});

app.get("/About", (req, res) => {
    res.render("About"); // Serve About page
    console.log("User authenticated, serving the About page");
});

// Route for Regina page
app.get("/regina", (req, res) => {
    res.render("Regina"); // Renders Regina.ejs
});

// Route for Moose Jaw page
app.get("/moose-jaw", (req, res) => {
    res.render("MJ"); // Renders MJ.ejs
});

// Route for Saskatoon page
app.get("/saskatoon", (req, res) => {
    res.render("Saskatoon"); // Renders Saskatoon.ejs
});
// Route for Saskatoon page
app.get("/MyAppointments", (req, res) => {
    res.render("MyAppointments"); // Renders MyAppointments.ejs
});

// Use routes from userController
app.use("/", userRoutes)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
