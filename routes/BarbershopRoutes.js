const express = require('express');
const router = express.Router();
const barberShopController = require('../controllers/BarbershopController');
const auth = require('../middleware/auth'); // Middleware to check JWT token

router.post('/addBarbershop', auth, barberShopController.addBarberShop);
router.put('/updateBarbershop/:id', auth, barberShopController.updateBarberShop);
router.get('/getBarbershop/:id', barberShopController.getBarberShop);
router.delete('/deleteBarbershop/:id', auth, barberShopController.deleteBarberShop);
router.post('/addReview/:id', auth, barberShopController.addReview);

module.exports = router;
