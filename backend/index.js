const ba = require("bitcoinaverage");
const express = require("express");
const socket = require("socket.io");
var app = express();
const server = app.listen(5000);
const io = socket(server);
const cors = require("cors");
app.use(cors());

var publicKey = "ZDE2YTY3ZDI3MmZmNDYzNjhhYTVkMmI5NDFmMjYwZmY";
var secretKey = "yourSecretKey";
var restClient = ba.restfulClient(publicKey, secretKey);

io.sockets.on("connection", function (socket) {
  // console.log(socket);
  sendData(socket);
});
function sendData(socket) {
  restClient.tickerLocalPerSymbol("BTCUSD", function (response) {
    // console.log(response);
    socket.emit("data", response);
  });

  setInterval(() => {
    sendData(socket);
  }, 5000);
}
