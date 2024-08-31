const Barber = require('../models/Barber');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BarberShop = require('../models/BarberShop');

// Register a new barber
exports.registerBarber = async (req, res) => {
  const { BarberName, BarberPrename, BarberEmail, BarberPassword, BarberphoneNumber, BarberImage, barberShop, role } = req.body;

  try {
    // Check if the barber already exists
    let barber = await Barber.findOne({ BarberEmail });
    if (barber) {
      return res.status(400).json({ success: false, message: 'Barber already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(BarberPassword, salt);

    // Create new barber
    barber = new Barber({
      BarberName,
      BarberPrename,
      BarberEmail,
      BarberPassword: hashedPassword,
      BarberphoneNumber,
      BarberImage,
      barberShop,
      role,
    });

    await barber.save();

    res.status(201).json({ success: true, data: barber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login barber
exports.loginBarber = async (req, res) => {
  const { BarberEmail, BarberPassword } = req.body;

  try {
    // Find the barber by email
    const barber = await Barber.findOne({ BarberEmail });
    if (!barber) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(BarberPassword, barber.BarberPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Create a token
    const token = jwt.sign(
      { id: barber._id, role: barber.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token, data: barber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Consult barber profile
exports.getProfile = async (req, res) => {
  try {
    const barber = await Barber.findById(req.barber.id).populate('barberShop');
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }
    res.status(200).json({ success: true, data: barber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update barber profile
exports.updateProfile = async (req, res) => {
  const { BarberName, BarberPrename, BarberEmail, BarberphoneNumber, BarberImage, role } = req.body;
  try {
    const barber = await Barber.findById(req.barber.id);
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    barber.BarberName = BarberName || barber.BarberName;
    barber.BarberPrename = BarberPrename || barber.BarberPrename;
    barber.BarberEmail = BarberEmail || barber.BarberEmail;
    barber.BarberphoneNumber = BarberphoneNumber || barber.BarberphoneNumber;
    barber.BarberImage = BarberImage || barber.BarberImage;
    barber.role = role || barber.role;

    await barber.save();

    res.status(200).json({ success: true, data: barber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout barber
exports.logoutBarber = async (req, res) => {
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



// Register a new assistant barber
exports.addAssistantBarber = async (req, res) => {
  const { BarberName, BarberPrename, BarberEmail, BarberPassword, BarberphoneNumber, BarberImage, barberShopId } = req.body;

  try {
    // Check if the logged-in user is an owner
    const ownerBarber = await Barber.findById(req.barber.id);
    if (!ownerBarber || ownerBarber.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'You do not have permission to add an assistant barber' });
    }

    // Check if the barber shop exists and belongs to the owner
    const barberShop = await BarberShop.findById(barberShopId);
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'Barber shop not found' });
    }
    
    // Ensure the barber shop belongs to the owner
    if (!ownerBarber.barberShop.equals(barberShopId)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to add barbers to this shop' });
    }

    // Check if the assistant barber already exists
    let barber = await Barber.findOne({ BarberEmail });
    if (barber) {
      return res.status(400).json({ success: false, message: 'Barber already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(BarberPassword, salt);

    // Create new assistant barber
    barber = new Barber({
      BarberName,
      BarberPrename,
      BarberEmail,
      BarberPassword: hashedPassword,
      BarberphoneNumber,
      BarberImage,
      barberShop: barberShopId, // Associate the assistant with the barber shop
      role: 'assistant',
    });

    await barber.save();

    // Add the new assistant barber to the barber shop
    barberShop.barbers.push(barber._id);
    await barberShop.save();

    res.status(201).json({ success: true, data: barber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Delete an assistant barber
exports.deleteAssistantBarber = async (req, res) => {
  const { barberShopId, assistantBarberId } = req.body;

  try {
    // Check if the logged-in user is an owner
    const ownerBarber = await Barber.findById(req.barber.id);
    if (!ownerBarber || ownerBarber.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete an assistant barber' });
    }

    // Check if the barber shop exists and belongs to the owner
    const barberShop = await BarberShop.findById(barberShopId);
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'Barber shop not found' });
    }
    
    // Ensure the barber shop belongs to the owner
    if (!ownerBarber.barberShop.equals(barberShopId)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to manage barbers in this shop' });
    }

    // Check if the assistant barber exists and is associated with the barber shop
    const assistantBarber = await Barber.findById(assistantBarberId);
    if (!assistantBarber || assistantBarber.role !== 'assistant') {
      return res.status(404).json({ success: false, message: 'Assistant barber not found' });
    }

    if (!assistantBarber.barberShop.equals(barberShopId)) {
      return res.status(400).json({ success: false, message: 'The assistant barber is not associated with this barber shop' });
    }

    // Remove the assistant barber from the barber shop's barbers array
    barberShop.barbers = barberShop.barbers.filter(barber => !barber.equals(assistantBarberId));
    await barberShop.save();

    // Remove the assistant barber's profile
    await Barber.findByIdAndDelete(assistantBarberId);

    res.status(200).json({ success: true, message: 'Assistant barber deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};