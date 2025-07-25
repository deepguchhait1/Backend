import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {};
const userInfoMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const { userId, fullName, email, profilePic } = socket.handshake.query;
  if (userId) {
    userSocketMap[userId] = socket.id;
    userInfoMap[userId] = { userId, fullName, email, profilePic };
  }

  io.emit("getOnlineUsers", Object.values(userInfoMap));

  socket.on("disconnect", () => {
    console.log("A user Disconnected", socket.id);
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      delete userInfoMap[disconnectedUserId];
    }
    io.emit("getOnlineUsers", Object.values(userInfoMap));
  });
});
export { io, app, server, userSocketMap };

