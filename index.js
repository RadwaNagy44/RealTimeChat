const { Server } = require("socket.io");
const { join } = require('node:path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.get('/', (req,res) => {
    res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('set username', (username) => {
        socket.username = username;
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.username || 'Anonymous'}`);
    });

    socket.on('chat message', (data) => {
        console.log(`${data.username}: ${data.message}`);
        io.emit('chat message', data);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop_typing', () => {
        socket.broadcast.emit('stop_typing');
    });
});

server.listen(3000,() => {
    console.log("Server is running on port 3000");
})
