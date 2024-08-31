const jwt = require('jsonwebtoken');
const Barber = require('../models/Barber');
const Customer = require('../models/Customer');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (['owner', 'assistant'].includes(decoded.role)) {
      user = await Barber.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Barber not found or token is not valid' });
      }
      req.barber = user; // Attach the barber to req
    } else if (decoded.role === 'customer') {
      user = await Customer.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Customer not found or token is not valid' });
      }
      req.customer = user; // Attach the customer to req
    } else {
      return res.status(401).json({ success: false, message: 'Invalid role in token' });
    }

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};
