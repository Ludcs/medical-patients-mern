const mongoose = require('mongoose');
require('dotenv').config();

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CNN);
    console.log('Connected to DB');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectionDB;
