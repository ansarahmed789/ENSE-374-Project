const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    medicalId: String // Optional for non-medical users
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;