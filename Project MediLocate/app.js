const express = require("express");
const app = express();
const port = 3000;

// Import userController
const userRoutes = require("./Controller/userController");

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the public directory

// Route for the root path
app.get("/", (req, res) => {
    res.redirect("/Login"); // Redirect to the login page
});

// Route for login page
app.get("/Login", (req, res) => {
    res.sendFile(__dirname + "/public/pages/Login.html"); // Serve Login page
    console.log("A user requested the Login page");
});

// Route for signup page
app.get("/Signup", (req, res) => {
    res.sendFile(__dirname + "/public/pages/Signup.html"); // Serve Signup page
    console.log("A user requested the Signup page");
});

// Route for home page
app.get("/Home", (req, res) => {
    res.sendFile(__dirname + "/public/pages/home.html"); // Serve Home page
    console.log("User authenticated, serving the Home page");
});

app.get("/SignupMedical", (req, res) => {
    res.sendFile(__dirname + "/public/pages/SignupMedical.html"); // Serve Signup Medical page
    console.log("User authenticated, serving the Signup page");
});

app.get("/About", (req, res) => {
    res.sendFile(__dirname + "/public/pages/About.html"); // Serve About page
    console.log("User authenticated, serving the About page");
});

app.get("/FindClinic1", (req, res) => {
    res.sendFile(__dirname + "/public/pages/Regina.html"); // Serve About page
    console.log("User authenticated, serving the Regina page");
});

app.get("/FindClinic2", (req, res) => {
    res.sendFile(__dirname + "/public/pages/Saskatoon.html"); // Serve About page
    console.log("User authenticated, serving the Saskatoon page");
});

app.get("/FindClinic3", (req, res) => {
    res.sendFile(__dirname + "/public/pages/MJ.html"); // Serve About page
    console.log("User authenticated, serving the Moose Jaw page");
});

// Use routes from userController
app.use("/", userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
