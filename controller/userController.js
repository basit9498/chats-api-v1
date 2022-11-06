const { validationResult } = require("express-validator");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

// User Create New Account
exports.createAccount = async (req, res, next) => {
  try {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
      const errorDetail = validErrors.array().map((error) => {
        return error.msg;
      });

      const error = new Error("Input Validation Error");
      error.detail = errorDetail;
      error.status = 422;
      throw error;
    }
    const { name, email, password, image } = req.body;
    const user = await User({
      name,
      email,
      password,
      image: image
        ? image
        : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    });

    await user.save();
    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

// User Login

exports.userLogin = async (req, res, next) => {
  try {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
      const errorDetail = validErrors.array().map((error) => {
        return error.msg;
      });

      const error = new Error("Input Validation Error");
      error.detail = errorDetail;
      error.status = 422;
      throw error;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Invalide UserName & Password!");
      error.status = 404;
      throw error;
    }
    //
    if (!(await user.passwordCompare(password))) {
      const error = new Error("Invalide UserName & Password!");
      error.status = 404;
      throw error;
    }

    const token = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};
