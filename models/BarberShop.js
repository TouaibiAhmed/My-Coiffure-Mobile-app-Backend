const mongoose = require('mongoose');

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
  gallery: [
    {
      type: String,
    }
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },

  barbers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber'
    }
  ]


}, {
  timestamps: true
});

const BarberShop = mongoose.model('BarberShop', barberShopSchema);

module.exports = BarberShop;
