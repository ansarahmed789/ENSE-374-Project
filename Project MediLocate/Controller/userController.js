const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const passport = require("passport");

const User = require("../Model/userModel"); // Import the User model (adjust the path accordingly)

const usersFilePath = path.join(__dirname, "/users.json");

// POST route to handle login
router.post("/Login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: false // Add flash messages if you want to show error messages
    }));


router.post("/Signup", async(req, res) => {
    try {
    console.log(req.body); // Debugging: Log request body

    const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ username: email });
        if (userExists) {
            return res.status(400).send("User already exists. Please log in.");
        }

        // Create new user
        const newUser = new User({
            name: name,
            username: email,
            password: password
        });

        await newUser.save();

        // Log the user in automatically
        req.login(newUser, (err) => {
            if (err) return res.status(500).send("Server error");
            return res.redirect("/home");
        });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Server error");
    }
    });


router.post("/SignupMedical", async (req, res) => {
    try {
    console.log(req.body); // Debugging: Log request body
    const newMedicalUser = new User({
        name: req.body["name"],
        username: req.body["email"],
        password: req.body["password"],
        medicalid: req.body["medicalId"]
    });
            const userExists =await User.findOne({ username: newMedicalUser.username });

            if (userExists) {
                console.log("Medical user already exists:", newMedicalUser.username);
                return res.redirect("/Login");
            }
        // Save the new medical user to MongoDB
        await newMedicalUser.save();         
                console.log("New medical user added successfully:", newMedicalUser);
                    res.redirect("/Home"); // Redirect to the home page

        } catch (error) {
            console.error("Error parsing users.json:", error);
            res.status(500).send("Server error");
        }
    });
    // Protect /home route
router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home"); // Render home.ejs if user is authenticated
    } else {
        res.redirect("/login");
    }
});
// Protect /myAppointments route
router.get("/myAppointments", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const appointments = await Appointment.find({ userId: req.user._id });
            res.render("MyAppointments", { appointments });
        } catch (error) {
            console.error("Error fetching appointments:", error);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Server error");
        }
        res.redirect("/login");
    });
});

module.exports = router;
