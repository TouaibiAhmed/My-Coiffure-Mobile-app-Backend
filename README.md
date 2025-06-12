# MyCoiffure Backend 

A robust RESTful API backend for the MyCoiffure mobile application, built with Node.js and Express.js. This API powers a beauty salon booking system with features for customers, barbers, barbershops, and appointment management.

## 🚀 Features

- **User Management**
  - Customer authentication and profile management
  - Barber and barbershop registration and profiles
  - Secure session handling with JWT

- **Appointment System**
  - Real-time reservation management
  - Timetable scheduling
  - Availability tracking

- **Business Management**
  - Barbershop profile and service management
  - Barber scheduling and availability
  - Service catalog management

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcryptjs
- **API Security:** CORS, express-session
- **Environment Variables:** dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Customer Routes
- `POST /api/customer/register` - Register new customer
- `POST /api/customer/login` - Customer login
- `GET /api/customer/profile` - Get customer profile

### Barber Routes
- `POST /api/barber/register` - Register new barber
- `GET /api/barber/profile` - Get barber profile
- `PUT /api/barber/availability` - Update availability

### Barbershop Routes
- `POST /api/barbershop/register` - Register new barbershop
- `GET /api/barbershop/profile` - Get barbershop profile
- `PUT /api/barbershop/services` - Update services

### Reservation Routes
- `POST /api/reservation` - Create new reservation
- `GET /api/reservation/:id` - Get reservation details
- `PUT /api/reservation/:id` - Update reservation

### Timetable Routes
- `GET /api/timetable` - Get available time slots
- `POST /api/timetable` - Create time slot
- `PUT /api/timetable/:id` - Update time slot

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled for secure cross-origin requests
- Session management with express-session

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- All contributors who have helped shape this project
