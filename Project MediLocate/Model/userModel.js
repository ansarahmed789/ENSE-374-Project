const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    medicalId: { type: String, required: false }, // Optional for non-medical users
});

// Create the User model
const User = mongoose.model("User", userSchema);
module.exports = User;