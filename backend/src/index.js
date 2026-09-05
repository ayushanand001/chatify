import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const port = process.env.PORT || 5001;

// Trust reverse proxy (Render, Railway, Heroku, Vercel, Nginx) for secure cookies
app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const allowedOrigins = [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, "") : null,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        return callback(null, true); // Alternatively allow dynamically while retaining credentials
    },
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
    connectDB();
});