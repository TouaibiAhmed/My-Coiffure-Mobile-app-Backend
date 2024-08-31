const mongoose = require('mongoose');
const availabilitySchema = require('./BarberAvailability'); // Ensure this path is correct

const barberSchema = new mongoose.Schema({
  BarberName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  BarberPrename: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
  },
  BarberEmail: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Veuillez fournir une adresse email valide'],
  },
  BarberPassword: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
  },
  BarberphoneNumber: {
    type: String,
    trim: true,
  },
  BarberImage: {
    type: String,
  },
  barberShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarberShop',
  },
  role: {
    type: String,
    enum: ['owner', 'assistant'],
    default: 'owner',
  },
  availability: [availabilitySchema], // Ensure the availabilitySchema is correctly defined and imported
}, {
  timestamps: true,
});

const Barber = mongoose.model('Barber', barberSchema);

module.exports = Barber;
