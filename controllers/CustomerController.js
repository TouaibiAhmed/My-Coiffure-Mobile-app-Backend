const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new customer
exports.registerCustomer = async (req, res) => {
  const { CustomerName, CustomerEmail, CustomerPassword, CustomerAddress, CustomerPhoneNumber } = req.body;

  // Basic validation
  if (!CustomerName || !CustomerEmail || !CustomerPassword) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  try {
      // Additional check for null email values
      if (CustomerEmail === null || CustomerEmail === undefined) {
          return res.status(400).json({ success: false, message: 'Email cannot be null or undefined' });
      }

      let customer = await Customer.findOne({ CustomerEmail });
      if (customer) {
          return res.status(400).json({ success: false, message: 'Customer already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(CustomerPassword, salt);

      customer = new Customer({
          CustomerName,
          CustomerEmail,
          CustomerPassword: hashedPassword,
          CustomerAddress,
          CustomerPhoneNumber,
      });

      await customer.save();
      res.status(201).json({ success: true, data: customer });
  } catch (error) {
      console.error('Error in registering customer:', error);
      res.status(500).json({ success: false, message: error.message, error });
  }
};




// Login customer
exports.loginCustomer = async (req, res) => {
  const { CustomerEmail, CustomerPassword } = req.body;

  try {
    // Find the customer by email
    const customer = await Customer.findOne({ CustomerEmail });
    if (!customer) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(CustomerPassword, customer.CustomerPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Create a token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ success: true, token, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Consult customer profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
  const { CustomerName, CustomerEmail, CustomerAddress, CustomerPhoneNumber } = req.body;
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer.CustomerName = CustomerName || customer.CustomerName;
    customer.CustomerEmail = CustomerEmail || customer.CustomerEmail;
    customer.address = CustomerAddress || customer.CustomerAddress;
    customer.CustomerPhoneNumber = CustomerPhoneNumber || customer.CustomerPhoneNumber;

    await customer.save();

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout customer
exports.logoutCustomer = async (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send({ message: "Error during logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).send({ message: "Successfully logged out" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error during logout", error: error.message });
  }
};
