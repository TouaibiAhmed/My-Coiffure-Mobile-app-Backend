const BarberShop = require('../models/BarberShop');
const Barber = require('../models/Barber');


// Add a new BarberShop
exports.addBarberShop = async (req, res) => {
  const { shopName, location, shopImage, description, gallery } = req.body;

  try {
    // Check if the logged-in user is an owner
    const ownerBarber = await Barber.findById(req.barber.id);
    if (!ownerBarber || ownerBarber.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'You do not have permission to add a barbershop' });
    }

    // Create new barber shop
    const barberShop = new BarberShop({
      shopName,
      location,
      shopImage,
      description,
      gallery,
      barbers: [ownerBarber._id], // Add the owner barber to the barbers array
    });

    await barberShop.save();

    // Update the owner's barberShop field
    ownerBarber.barberShop = barberShop._id;
    await ownerBarber.save();

    res.status(201).json({ success: true, data: barberShop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a BarberShop
exports.updateBarberShop = async (req, res) => {
  const { id } = req.params;
  const { shopName, location, shopImage, description, gallery, isOpen, barbers } = req.body;

  try {
    const barberShop = await BarberShop.findById(id);
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'BarberShop not found' });
    }

    barberShop.shopName = shopName || barberShop.shopName;
    barberShop.location = location || barberShop.location;
    barberShop.shopImage = shopImage || barberShop.shopImage;
    barberShop.description = description || barberShop.description;
    barberShop.gallery = gallery || barberShop.gallery;
    barberShop.isOpen = isOpen !== undefined ? isOpen : barberShop.isOpen;
    barberShop.barbers = barbers || barberShop.barbers;

    await barberShop.save();
    res.status(200).json({ success: true, data: barberShop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a BarberShop
exports.getBarberShop = async (req, res) => {
  const { id } = req.params;

  try {
    const barberShop = await BarberShop.findById(id).populate('barbers');
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'BarberShop not found' });
    }

    res.status(200).json({ success: true, data: barberShop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a BarberShop
exports.deleteBarberShop = async (req, res) => {
  const { id } = req.params;

  try {
    const barberShop = await BarberShop.findById(id);
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'BarberShop not found' });
    }

    await barberShop.remove();
    res.status(200).json({ success: true, message: 'BarberShop removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review (stars)
exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  try {
    const barberShop = await BarberShop.findById(id);
    if (!barberShop) {
      return res.status(404).json({ success: false, message: 'BarberShop not found' });
    }

    // Update review score and increment number of ratings
    barberShop.review = review;
    barberShop.numberOfRatings += 1; // Increment the number of ratings

    await barberShop.save();
    res.status(200).json({ success: true, data: barberShop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all BarberShops with additional details
exports.getAllBarberShops = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Monday"

    // Retrieve all barbershops
    const barberShops = await BarberShop.find()
      .populate('barbers')
      .exec();

    // Format the barbershops with working times for the current date
    const formattedBarberShops = barberShops.map(barberShop => {
      // Find the timetable entry for the current day
      const todayTimetable = barberShop.timetable.find(timetable => 
        timetable.days.includes(dayOfWeek)
      );

      return {
        shopName: barberShop.shopName,
        location: barberShop.location,
        shopImage: barberShop.shopImage,
        review: barberShop.review,
        numberOfRatings: barberShop.numberOfRatings,
        isOpen: barberShop.isOpen,
        workingTimes: todayTimetable ? {
          startTime: todayTimetable.startTime,
          endTime: todayTimetable.endTime
        } : null
      };
    });

    res.status(200).json({ success: true, data: formattedBarberShops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
