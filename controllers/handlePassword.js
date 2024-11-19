require("dotenv").config();
const {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
} = require("../configs/mailer");
const { io } = require("../configs/serverSocket");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

class handlePassword {
  static async renderKonfirmasi(req, res) {
    res.render("konfirmasi-email");
  }
  static async konfirmasiPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        const error = new Error("akun tidak terdeteksi");
        throw error;
      }

      const payload = {
        id: user.id,
        nama: user.nama,
      };
      const secret = process.env.JWT_SECRET;
      const resetToken = jwt.sign(payload, secret, { expiresIn: "1h" });
      req.session.token = resetToken;

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      sendForgotPasswordEmail(email, resetLink);

      io.emit("notification", `klik link reset password di gmail anda`);
      console.log(
        "notifikasi ke client:",
        `klik link reset password di gmail anda`
      );

      res.render("cekEmail");
    } catch (error) {
      io.emit("notification", "Terjadi kesalahan. Silakan coba lagi.");
      console.error("Kesalahan saat konfirmasi email:", error);

      return res.render("konfirmasi-email", {
        error: `gagal: ${error}`,
      });
    }
  }
  static async renderReset(req, res) {
    const { token } = req.query;
    if (!token) {
      res.render("reserPassword", {
        error: `gagal: ${error}`,
      });
    }
    res.render("resetPassword", { token });
  }

  static async resetPassword(req, res) {
    const { email, token, newPassword } = req.body;

    if (!token || !newPassword || !email) {
      return res
        .status(400)
        .json({ message: "Token, email, dan password diperlukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token tidak valid atau sudah kadaluarsa." });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
        if (!user) {
          return res.status(404).json({ message: "Akun tidak ada." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
          where: { id: decoded.id },
          data: { password: hashedPassword }, // Hanya memperbarui password
        });

        await sendSuccesPasswordEmail(email); // Pastikan untuk menggunakan await
        console.log("Notifikasi akan dikirim ke klien");
        io.emit("notification", "Berhasil reset password");
      } catch (error) {
        io.emit("notification", "Terjadi kesalahan. Silakan coba lagi.");
        console.error("Kesalahan saat konfirmasi email:", error);

        return res.render("resetPassword", {
          error: `gagal: ${error}`,
        });
      }
    });
  }
}

module.exports = handlePassword;
