import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});


const userSocketMap = { //this map stores socket id corresponding the user io; userId -> socketId
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: UserId = ${userId}, socketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));


    socket.on("disconnect", () => {
        if (userId) {
            console.log(`User disconnected: UserId = ${userId}, socketId = ${socket.id}`);
            delete userSocketMap[userId]
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

    })

});

export {app , httpServer , io};