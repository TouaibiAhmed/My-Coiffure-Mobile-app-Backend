
const mongoose = require('mongoose');



// Define the availability schema for each barber

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      time: {
        type: String,
        required: true,
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

module.exports = availabilitySchema;

  