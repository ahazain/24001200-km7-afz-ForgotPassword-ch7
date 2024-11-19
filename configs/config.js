require("dotenv").config();

module.exports = {
  dataBaseUrl: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
