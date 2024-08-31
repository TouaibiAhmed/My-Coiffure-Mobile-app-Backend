const mongoose = require('mongoose');
const timetableSchema = require('./Timetable'); // Ensure this path is correct

const barberShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  shopImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  review: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numberOfRatings: {
    type: Number,
    default: 0, // Initialize with 0 ratings
  },
  gallery: [
    {
      type: String,
    },
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },
  barbers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
    },
  ],
  timetable: [timetableSchema], // Ensure the timetableSchema is correctly defined and imported
}, {
  timestamps: true,
});

const BarberShop = mongoose.model('BarberShop', barberShopSchema);

module.exports = BarberShop;
