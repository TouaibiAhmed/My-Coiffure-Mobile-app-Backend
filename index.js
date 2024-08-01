

const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const bodyParser = require('body-parser');




require('dotenv').config();




const customerRoutes = require('./routes/CustomerRoutes');

const barberRoutes = require('./routes/BarberRoutes');

const barbershopRoutes = require('./routes/BarbershopRoutes');

const reservationRoutes = require('./routes/ReservationRoutes');





const app = express();

const port = process.env.PORT || 3000;




const connectDB = require('./config/db'); 




// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Connecter à la base de données
connectDB();




app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));







app.use('/api/customer', customerRoutes);
app.use('/api/barber', barberRoutes);

app.use('/api/reservation', reservationRoutes);


app.use('/api/barbershop', barbershopRoutes);






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
