// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    clinicName: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
