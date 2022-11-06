const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const getAuthHeader = req.get("Authorization");

  if (getAuthHeader?.split(" ")[0] !== "Bearer") {
    return res.status(404).json({
      message: "Not Auth Provided",
    });
  }

  let decode;
  const getToken = getAuthHeader?.split(" ")[1];
  try {
    decode = jwt.verify(getToken, process.env.TOKEN_KEY);
  } catch (error) {
    error.status = 500;
    throw error;
  }

  if (!decode) {
    const error = new Error("Not Authenticated !");
    error.status = 401;
    throw error;
  }

  req.user = decode.user_id;
  next();
};

module.exports = isAuth;
