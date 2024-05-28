const { Server } = require("socket.io");
// const http = require("http");
const express = require("express");

const cluster = require("node:cluster");
const http = require("node:http");
const { availableParallelism } = require("node:os");
const process = require("node:process");

const numCPUs = availableParallelism();

let app, server, io;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app = express();

  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("a user connected");
    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });
  });

  console.log(`Worker ${process.pid} started`);
}

module.exports = { io, app, server };
