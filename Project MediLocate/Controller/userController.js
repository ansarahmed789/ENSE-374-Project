const fs = require("fs");
const express = require("express");
const router = express.Router();

// POST route to handle login
router.post("/Login", (req, res) => {
    console.log(req.body); // Debugging: Log request body
    const { username, password } = req.body;

    // Read the users.json file
    fs.readFile(__dirname + "/../users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading file from disk:", err);
            return res.status(500).send("Server error");
        }

        try {
            const users = JSON.parse(jsonString);
            const user = users.find((u) => u.username === username && u.password === password);

            if (user) {
                res.redirect("/home"); // Redirect to the home page
            } else {
                res.status(401).send("Invalid credentials, please try again.");
            }
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).send("Server error");
        }
    });
});

// POST route to handle signup
router.post("/Signup", (req, res) => {
    console.log(req.body); // Debugging: Log request body
    const { name, username, password } = req.body;

    // Read the users.json file
    fs.readFile(__dirname + "/../users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.error("Error reading file from disk:", err);
            return res.status(500).send("Server error");
        }

        try {
            const users = JSON.parse(jsonString);

            // Check if user already exists
            const userExists = users.find((u) => u.username === username);
            if (userExists) {
                return res.status(400).send("User already exists. Please log in.");
            }

            // Add new user to the users array
            const newUser = { name, username, password };
            users.push(newUser);

            // Write the updated users array back to the file
            fs.writeFile(__dirname + "/../users.json", JSON.stringify(users, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error("Error writing file to disk:", writeErr);
                    return res.status(500).send("Server error");
                }

                res.redirect("/home"); // Redirect to the home page
            });
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).send("Server error");
        }
    });
});

module.exports = router;
