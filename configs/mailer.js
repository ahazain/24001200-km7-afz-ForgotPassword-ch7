require("dotenv").config();
const nodemailer = require("nodemailer");

// config nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahazain56@gmail.com",
    pass: "huih uywl pkmy axnt",
  },
});
const sendForgotPasswordEmail = (email, resetLink) => {
  transporter.sendMail({
    from: "ahazain56@gmail.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
const sendSuccesPasswordEmail = (email) => {
  transporter.sendMail({
    from: "ahazain56@gmail.com",
    to: email,
    subject: "Berhasil Reset  Password",
    html: `sukses reset password`,
  });
};
const sendWelcomeEmail = (email) => {
  transporter.sendMail(
    {
      from: "ahazain56@gmail.com",
      to: email,
      subject: "Welcome to Our Platform!",
      text: "Thank you for joining our platform. We are glad to have you!",
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    }
  );
};

module.exports = {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
  sendWelcomeEmail,
};
