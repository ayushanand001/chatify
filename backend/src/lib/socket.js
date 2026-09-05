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
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        socket.join(String(userId));
        io.emit("onlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            io.emit("onlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, server, app };