const mongoose = require("mongoose");

const connectionDB = async (callback) => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((connect) => {
      callback();
    })
    .catch((error) => {
      console.log("DB Error:", error);
    });
};

module.exports = connectionDB;
