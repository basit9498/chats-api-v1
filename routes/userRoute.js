const express = require("express");
const userController = require("../controller/userController");
const { body } = require("express-validator");
const User = require("../model/userModel");

const route = express.Router();

route.post(
  "/account",
  [
    body("name", "Please Provide The Name").isLength({ min: 3 }).trim(),
    body("email", "Please Provide Email")
      .isEmail()
      .bail()
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is Already Exsist");
          }
          return true;
        });
      }),
    body("password", "Password atleast 6 Charcter")
      .notEmpty()
      .bail()
      .isLength({ min: 6 })
      .bail()
      .isAlphanumeric(),
    body("conform_password", "Please Provide conform password ")
      .notEmpty()
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password & Conform Password Not Match");
        }
        return true;
      }),
  ],
  userController.createAccount
);
route.post(
  "/login",
  [
    body("email", "Please Provide Email").isEmail().bail().normalizeEmail(),
    body("password", "Password atleast 6 Charcter")
      .notEmpty()
      .bail()
      .isLength({ min: 6 }),
  ],
  userController.userLogin
);

module.exports = route;
