const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  barberShopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarberShop',
    required: true,
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'canceled', 'on hold'],
    default: 'on hold',
  },
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
