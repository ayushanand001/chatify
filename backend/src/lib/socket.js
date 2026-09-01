import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express();

const server = new http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

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