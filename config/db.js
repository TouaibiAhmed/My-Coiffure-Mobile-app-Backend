const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connexion à la base de données MongoDB réussie !');
  } catch (err) {
    console.error('Échec de la connexion à la base de données MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
