const express = require('express');
const router = express.Router();
const { addTimetable } = require('../controllers/TimetableController');
const authMiddleware = require('../middleware/auth');


const { updateTimetable, deleteTimetable } = require('../controllers/TimetableController');






router.post('/Addtimetable/:barbershopId', addTimetable);


router.put('/updatetimetable/:barbershopId/:timetableId', updateTimetable);
router.delete('/deletetimetable/:barbershopId/:timetableId', deleteTimetable);

module.exports = router;
