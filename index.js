

const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const bodyParser = require('body-parser');

const cors = require('cors');



require('dotenv').config();




const customerRoutes = require('./routes/CustomerRoutes');

const barberRoutes = require('./routes/BarberRoutes');

const barbershopRoutes = require('./routes/BarbershopRoutes');

const reservationRoutes = require('./routes/ReservationRoutes');

const timetableRoutes = require('./routes/TimetableRoutes');




const app = express();

const port = process.env.PORT || 3000;




const connectDB = require('./config/db'); 



app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



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

app.use('/api/timetable', timetableRoutes);




app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
