const express = require('express');
const router = express.Router();
const customerController = require('../controllers/CustomerController');
const auth = require('../middleware/auth'); // Middleware to check JWT token

router.post('/register', customerController.registerCustomer);
router.post('/login', customerController.loginCustomer);
router.get('/Getprofile', auth, customerController.getProfile);
router.put('/Updateprofile', auth, customerController.updateProfile);
router.post('/logout', auth, customerController.logoutCustomer);

router.post('/change-password', auth, customerController.changePassword);


module.exports = router;
