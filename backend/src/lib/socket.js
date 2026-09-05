import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = new http.createServer(app);

const allowedOrigins = [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, "") : null,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
        credentials: true
    }
});

export function getSocketIdByUserId(userId) {
    return userSocketMap[userId]
}

// UserSocketMap[userId] = socketId
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id)

    const userId = socket.handshake.query?.userId
    if(userId) userSocketMap[userId] = socket.id

    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        // Remove the user from the socket map when they disconnect
        console.log("user disconnected", socket.id)
        if(userId) delete userSocketMap[userId]
        io.emit("onlineUsers", Object.keys(userSocketMap));
    })
})

export {io, server, app}