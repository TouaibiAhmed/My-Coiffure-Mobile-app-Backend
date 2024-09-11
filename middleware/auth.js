const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the customer by ID
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Customer not found or token is not valid' });
    }

    // Attach the customer to the request
    req.customer = customer;

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};
