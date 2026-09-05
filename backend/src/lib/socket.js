import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // Allow all origins dynamically with credentials
            callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// UserSocketMap[userId] = socketId
const userSocketMap = {};

export function getSocketIdByUserId(userId) {
    if (!userId) return null;
    return userSocketMap[userId] || userSocketMap[String(userId)];
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query?.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };