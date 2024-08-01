const Reservation = require('../models/Reservation');
const BarberShop = require('../models/BarberShop');
const Barber = require('../models/Barber');
const Customer = require('../models/Customer');

// Add a new reservation
exports.addReservation = async (req, res) => {
  const { barberShopId, barberId, customerId, date, time } = req.body;

  try {
    const barberShop = await BarberShop.findById(barberShopId);
    const barber = await Barber.findById(barberId);
    const customer = await Customer.findById(customerId);

    if (!barberShop || !barber || !customer) {
      return res.status(404).json({ success: false, message: 'Invalid barberShop, barber, or customer ID' });
    }

    const reservation = new Reservation({
      barberShopId,
      barberId,
      customerId,
      date,
      time,
    });

    await reservation.save();
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept a reservation
exports.acceptReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    reservation.status = 'approved';
    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Decline a reservation
exports.declineReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    reservation.status = 'canceled';
    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
