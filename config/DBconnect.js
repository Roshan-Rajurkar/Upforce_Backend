const mongoose = require("mongoose");
require('dotenv').config()

const DBconnect = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
          });
        console.log(response.connection.host + " connected to db");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

module.exports = DBconnect;
