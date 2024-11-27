const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const mongoose = require ("mongoose");
const nodemailer = require("nodemailer");
const Appointment = require("../Model/Appointment"); // Import Appointment model
const User = require("../Model/userModel"); // Import the User model (adjust the path accordingly)

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
// router.get("/myAppointments", async (req, res) => {
//     if (req.isAuthenticated()) {
//         try {
//             const appointments = await Appointment.find({ userId: req.user._id });
//             res.render("MyAppointments", { appointments });
//         } catch (error) {
//             console.error("Error fetching appointments:", error);
//             res.status(500).send("Server error");
//         }
//     } else {
//         res.redirect("/login");
//     }
// });

//Route for book appointment 
router.post('/bookAppointment', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send({ success: false, message: 'You must be logged in to book an appointment.' });
    }

    try {
        const { clinicName, date, time } = req.body;
        const userId = req.user._id;

        // Check if an appointment for the same date and time already exists
        const existingAppointment = await Appointment.findOne({ clinicName, date, time, userId });
        if (existingAppointment) {
            return res.status(400).send({ success: false, message: 'You already have an appointment for this time.' });
        }

        // Create new appointment
        const newAppointment = new Appointment({
            userId,
            clinicName,
            date,
            time
        });

        await newAppointment.save();
        console.log('Appointment booked successfully:', newAppointment);

        // res.status(200).send({ success: true, message: 'Appointment booked successfully!' });
        
    } catch (error) {
        console.error('Error booking appointment:', error);
        // res.status(500).send({ success: false, message: 'Error booking appointment' });
    }
});

// Protect /myAppointments route
router.get("/myAppointments", async (req, res) => {
    if (!req.isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        return res.redirect("/login");
    }

    console.log("User authenticated, proceeding to fetch appointments...");

    try {
        if (!req.user) {
            console.log("No user found in req object, redirecting to login.");
            return res.redirect("/login");
        }

        console.log("Authenticated user details:", req.user); // Log the entire user object

        const appointments = await Appointment.find({ userId: req.user._id });

        // Log the results of the appointment query
        if (appointments.length > 0) {
            console.log("Retrieved appointments:", appointments);
        } else {
            console.log("No appointments found for user.");
        }

        // Render the MyAppointments page with the retrieved appointments
        res.render("MyAppointments", { appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("Server error");
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