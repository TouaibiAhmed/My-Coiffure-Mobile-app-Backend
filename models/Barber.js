const mongoose = require('mongoose');

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
    match: [/\S+@\S+\.\S+/, 'Veuillez fournir une adresse email valide']
  },
  BarberPassword: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire']
  },
  BarberphoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
  BarberImage: {
    type: String,
    required: false, 
  },

  barberShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarberShop',
    required: false,
  },


  role: {
    type: String,
    enum: ['owner', 'assistant'],
    required: false,
    default: 'owner',
  },


}, {
  timestamps: true
});

const Barber = mongoose.model('Barber', barberSchema);

module.exports = Barber;
