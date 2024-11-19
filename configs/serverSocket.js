require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

io.on("connection", (socket) => {
  console.log("sudah dibuat koneksi socket baru");

  socket.on("message", (message) => {
    console.log("pesan dari client:", message);
  });
  socket.emit("message", "Welcome to socket.io");

  socket.on("disconnect", () => {
    console.log("client terputus");
  });
});

module.exports = { server, io };
