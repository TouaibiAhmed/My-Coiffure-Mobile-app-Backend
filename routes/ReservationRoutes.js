const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
const auth = require('../middleware/auth'); // Middleware to check JWT token

router.post('/addReservation', auth, reservationController.addReservation);
router.put('/AcceptReservation/:id', auth, reservationController.acceptReservation);
router.put('/DeclineReservation/:id', auth, reservationController.declineReservation);

module.exports = router;
