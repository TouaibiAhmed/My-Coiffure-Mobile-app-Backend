const BarberShop = require('../models/BarberShop');
const Barber = require('../models/Barber');

const addTimetable = async (req, res) => {
  try {
    // Extract barberId from the logged-in user
    // Extract barbershopId from the URL parameters
    const { barbershopId } = req.params;
    const { barberId, timetable } = req.body;

    // Find the barber and check if they are the owner
    const barber = await Barber.findById(barberId);
    if (!barber || barber.role !== 'owner') {
      return res.status(403).json({ message: 'Only the owner can add a timetable.' });
    }

    // Find the barbershop
    const barbershop = await BarberShop.findById(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ message: 'Barbershop not found.' });
    }

    // Add the timetable to the barbershop
    barbershop.timetable.push(timetable);
    await barbershop.save();

    // Update all barbers' availability in this barbershop
    const barbers = await Barber.find({ barberShop: barbershopId });
    for (const barber of barbers) {
      timetable.days.forEach(day => {
        barber.availability.push({
          date: day,
          timeSlots: generateTimeSlots(timetable.startTime, timetable.endTime)
        });
      });
      await barber.save();
    }

    res.status(200).json({ message: 'Timetable added successfully.', barbershop });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

// Utility function to generate time slots
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = startTime;
  while (current < endTime) {
    slots.push({ time: current, isAvailable: true });
    current = addHour(current);
  }
  return slots;
};

// Utility function to add an hour to a time string (HH:MM)
const addHour = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newHours = (hours + 1) % 24;
  return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};





const updateTimetable = async (req, res) => {
  try {
    const { barbershopId, timetableId } = req.params;
    const { barberId, updatedTimetable } = req.body;

    // Find the barber and check if they are the owner
    const barber = await Barber.findById(barberId);
    if (!barber || barber.role !== 'owner') {
      return res.status(403).json({ message: 'Only the owner can update the timetable.' });
    }

    // Find the barbershop
    const barbershop = await BarberShop.findById(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ message: 'Barbershop not found.' });
    }

    // Find the timetable to update
    const timetable = barbershop.timetable.id(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found.' });
    }

    // Update the timetable fields
    timetable.days = updatedTimetable.days;
    timetable.startTime = updatedTimetable.startTime;
    timetable.endTime = updatedTimetable.endTime;

    await barbershop.save();

    // Update all barbers' availability in this barbershop
    const barbers = await Barber.find({ barberShop: barbershopId });
    for (const barber of barbers) {
      timetable.days.forEach(day => {
        barber.availability = barber.availability.map(slot =>
          slot.date === day ? { ...slot, timeSlots: generateTimeSlots(updatedTimetable.startTime, updatedTimetable.endTime) } : slot
        );
      });
      await barber.save();
    }

    res.status(200).json({ message: 'Timetable updated successfully.', barbershop });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};


const deleteTimetable = async (req, res) => {
  try {
    const { barbershopId, timetableId } = req.params;
    const { barberId } = req.body;

    // Find the barber and check if they are the owner
    const barber = await Barber.findById(barberId);
    if (!barber || barber.role !== 'owner') {
      return res.status(403).json({ message: 'Only the owner can delete the timetable.' });
    }

    // Find the barbershop
    const barbershop = await BarberShop.findById(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ message: 'Barbershop not found.' });
    }

    // Remove the timetable
    const timetable = barbershop.timetable.id(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found.' });
    }

    timetable.remove();
    await barbershop.save();

    // Update all barbers' availability in this barbershop
    const barbers = await Barber.find({ barberShop: barbershopId });
    for (const barber of barbers) {
      barber.availability = barber.availability.filter(slot => !timetable.days.includes(slot.date));
      await barber.save();
    }

    res.status(200).json({ message: 'Timetable deleted successfully.', barbershop });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};









module.exports = { addTimetable, updateTimetable, deleteTimetable  };
