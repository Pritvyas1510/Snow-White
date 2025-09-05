const jwt = require("jsonwebtoken");

exports.generateToken = (user, expiresInOneHour = false) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: expiresInOneHour ? "1h" : process.env.JWT_EXPIRATION || "7d",
  });
};
