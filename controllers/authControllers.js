require("dotenv").config();
const { sendWelcomeEmail } = require("../configs/mailer");
const jwt = require("jsonwebtoken");
const { io } = require("../configs/serverSocket");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

class Auth {
  static async renderRegister(req, res) {
    res.render("register");
  }
  static async register(req, res) {
    try {
      const { nama, email, password } = req.body;
      const data = await prisma.user.findUnique({ where: { email } });
      if (data) {
        const error = new Error("email sudah ada");
        throw error;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const dataAdd = await prisma.user.create({
        data: {
          nama,
          email,
          password: hashedPassword,
        },
      });
      const payload = {
        id: dataAdd.id,
        nama: dataAdd.nama,
      };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      req.session.token = token;
      sendWelcomeEmail(email);
      io.emit("notification", `berhasil registrasi: ${dataAdd.name}`);
      console.log(
        "notifikasi ke client:",
        `berhasil registrasi: ${dataAdd.nama}`
      );

      res.redirect("/login");
    } catch (error) {
      io.emit(
        "notification",
        "Terjadi kesalahan saat registrasi. Silakan coba lagi."
      );
      console.error("Kesalahan saat registrasi:", error);

      return res.render("register", {
        error: `Registrasi gagal. ${error}`,
      });
    }
  }
  static async renderLogin(req, res) {
    res.render("login");
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!user && !validatePassword) {
        const error = new Error("email or password wrong");
        throw error;
      }
      const payload = {
        id: user.id,
        nama: user.nama,
      };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      req.session.token = token;
      io.emit("notification", `berhasil login`);
      console.log("notifikasi ke client:", `berhasil login`);

      return res.redirect("/home");
    } catch (error) {
      io.emit(
        "notification",
        "Terjadi kesalahan saat login. Silakan coba lagi."
      );
      console.error("Kesalahan saat login:", error);

      return res.render("login", {
        error: `login gagal. ${error}`,
      });
    }
  }
  static async showHome(req, res) {
    res.render("home");
  }
}

module.exports = Auth;
