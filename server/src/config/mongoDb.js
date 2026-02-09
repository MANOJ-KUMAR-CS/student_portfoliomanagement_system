const mongoose = require('mongoose');

require("dotenv").config();

const mongooseConnection = async () => {

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Mongo db connected Successfully");

  } catch (err) {

    console.log(`Error occured in connecting to MongoDb \n ${err}`);

  }
};

mongooseConnection();


module.exports = mongooseConnection;