const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  CustomerName: {
    type: String,
    required: true,
    trim: true,
  },
  CustomerEmail: {
    type: String,
    required: true,
    unique: true,
    sparse: false,  
    lowercase: true,
  },
  CustomerPassword: {
    type: String,
    required: true,
  },
  CustomerAddress: {
    type: String,
    required: false,
    trim: true,
  },
  CustomerPhoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
