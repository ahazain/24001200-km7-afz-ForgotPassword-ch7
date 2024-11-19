const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const handlePassword = require("../controllers/handlePassword");
const authControllers = require("../controllers/authControllers");
const auth = require("../middleware/authentication");

route.get("/register", authControllers.renderRegister);
route.post("/register", authControllers.register);
route.get("/login", authControllers.renderLogin);
route.post("/login", authControllers.login);
route.get("/home", auth, authControllers.showHome);
route.get("/konfirmasi-email", auth, handlePassword.renderKonfirmasi);
route.post("/konfirmasi-email", auth, handlePassword.konfirmasiPassword);
route.get("/reset-password", auth, handlePassword.renderReset);
route.post("/reset-password", auth, handlePassword.resetPassword);

module.exports = route;
