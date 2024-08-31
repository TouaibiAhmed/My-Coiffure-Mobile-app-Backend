const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  days: [
    {
      type: String,
      required: true,
    },
  ],
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

module.exports = timetableSchema;
