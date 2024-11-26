const express = require("express");
const router = express.Router();
const path = require("path");

const usersFilePath = path.join(__dirname, "/users.json");

// POST route to handle login
router.post("/Login", (req, res) => {
    console.log(req.body); // Debugging: Log request body

    const useremail = req.body["username"];
    const reqPassword = req.body["password"];

    // Read the JSON file
    fs.readFile(usersFilePath, "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send("Server error");
        }

        try {
            const users = JSON.parse(jsonString);

            // Find the user in the JSON file
            const userExists = users.find((user) => user.username === useremail && user.password === reqPassword);

            if (userExists) {
                console.log("User logged in successfully:", useremail);
                res.redirect("/Home"); // Redirect to the home page
            } else {
                console.log("Invalid credentials for username:", useremail);
                res.redirect("/"); // Redirect to login page
            }
        } catch (parseErr) {
            console.error("Error parsing users.json:", parseErr);
            res.status(500).send("Server error");
        }
    });
});

router.post("/Signup", (req, res) => {
    console.log(req.body); // Debugging: Log request body

    const newUser = {
        name: req.body["name"],
        username: req.body["username"],
        password: req.body["password"]
    };

    // Read the JSON file
    fs.readFile(usersFilePath, "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send("Server error");
        }

        try {
            const users = JSON.parse(jsonString);

            // Check if the user already exists
            const userExists = users.find((user) => user.username === newUser.username);
            if (userExists) {
                console.log("User already exists:", newUser.username);
                return res.status(400).send("User already exists. Please log in.");
            }

            // Add new user to the array
            users.push(newUser);

            // Write the updated users array back to the file
            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8", (writeErr) => {
                if (writeErr) {
                    console.error("Error writing to users.json:", writeErr);
                    return res.status(500).send("Server error");
                }

                console.log("New user added successfully:", newUser);
                res.redirect("/Home"); // Redirect to the home page
            });
        } catch (parseErr) {
            console.error("Error parsing users.json:", parseErr);
            res.status(500).send("Server error");
        }
    });
});

router.post("/SignupMedical", (req, res) => {
    console.log(req.body); // Debugging: Log request body
    const newMedicalUser = {
        name: req.body["name"],
        username: req.body["username"],
        password: req.body["password"],
        medicalid: req.body["medicalId"]
    };

    // Read the users.json file
    fs.readFile(usersFilePath, "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send("Server error");
        }

        try {
            const users = JSON.parse(jsonString);
            const userExists = users.find(user => user.username === newMedicalUser.username);

            if (userExists) {
                console.log("Medical user already exists:", newMedicalUser.username);
                return res.redirect("/");
            } else {
                users.push(newMedicalUser);
                console.log("New medical user added successfully:", newMedicalUser);

                // Write the updated users array back to the file
                fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8", writeErr => {
                    if (writeErr) {
                        console.error("Error writing to users.json:", writeErr);
                        return res.status(500).send("Server error");
                    }

                    res.redirect("/Home"); // Redirect to the home page
                });
            }
        } catch (parseErr) {
            console.error("Error parsing users.json:", parseErr);
            res.status(500).send("Server error");
        }
    });
});

module.exports = router;
