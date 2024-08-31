const express = require('express');
const router = express.Router();
const barberController = require('../controllers/BarberController');
const auth = require('../middleware/auth'); // Middleware to check JWT token

router.post('/register', barberController.registerBarber);
router.post('/login', barberController.loginBarber);
router.get('/Getprofile', auth, barberController.getProfile);
router.put('/Updateprofile', auth, barberController.updateProfile);
router.post('/logout', auth, barberController.logoutBarber);

router.post('/AddAssistant', auth, barberController.addAssistantBarber);





module.exports = router;
