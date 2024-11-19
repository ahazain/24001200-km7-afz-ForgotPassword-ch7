const jwt = require("jsonwebtoken");
require("dotenv").config();

function autentikasi(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : req.session.token;

  if (!token) {
    const error = new Error("Token tidak ditemukan");
    error.status = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      const err = new Error("Token tidak valid");
      err.status = 401;
      return next(err);
    }
    req.user = user;
    next();
  });
}

module.exports = autentikasi;
