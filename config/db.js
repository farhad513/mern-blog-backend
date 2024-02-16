const mongoose = require("mongoose");

const database = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_LIVE);
    console.log(
      `Database connection established on ${mongoose.connection.host}`
    );
  } catch (error) {
    console.log(`Database Error: ${error}`);
  }
};

module.exports = database;
