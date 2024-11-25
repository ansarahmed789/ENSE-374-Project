const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

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

const clinicsData = {
    regina: [
      "Meadow Primary Health Care Center - 4006 Dewdney Avenue",
      "Victoria East Medical Clinic - 2068 Prince of Wales Dr",
      "Northgate Medical Clinic - 5885 Rochdale Blvd",
      "South End Medical Clinic - 3400 Partridge Crescent"
    ],
    saskatoon: [
      "Lakeside Medical Clinic - 215 Joseph Okemasis Dr",
      "Saskatoon Health Center - 123 Central Ave",
      "Broadway Health Clinic - 987 Broadway Ave",
      "Stonebridge Medical Center - 456 Stonebridge Blvd"
    ],
    MooseJaw: [
      "Alliance Health Medical Center - 890-A Lillooet St W",
      "Hillcrest Medical Clinic - 200 Hill St",
      "Prairie Sky Medical Center - 45 Main St",
      "Heritage Medical Clinic - 67 Heritage Dr"
    ]
  };
  
  app.get("/results", (req, res) => {
    const city = req.query.city.toLowerCase();
    const clinics = clinicsData[city] || [];
    res.render("results", { cityName: city.charAt(0).toUpperCase() + city.slice(1), clinics });
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
    res.render("home"); // Serve home.ejs
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

// Use routes from userController
app.use("/", userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
