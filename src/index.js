import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import { app,server } from "./lib/socket.io.js";
import path from "path";

// const app = express();
dotenv.config({ path: "./.env" });


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-chat-app-sigma.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const port =process.env.PORT || 3000;

server.listen(port, (err) => {
  console.log(`Server is Running in http://localhost:${port}/`);
  connectDB()
});
