const express = require("express");
const bodyParse = require("body-parser");

const connectionDB = require("./config/dbConnection");
const { errorHandler } = require("./middleware/error-handler");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");

const PORT = process.env.PORT || 5000;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,OPTIONS,DELETE,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use(errorHandler);

connectionDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server Run In ${process.env.PORT} port`);
  });
});
