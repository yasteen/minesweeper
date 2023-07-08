"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const PORT = 4000;
const connectionOptions = process.env.NODE_ENV === "dev" ? {
    cors: { origin: "http://localhost:3000" }
} : {};
const io = new socket_io_1.Server(connectionOptions);
io.on("connection", (socket) => {
    console.log("Hello there");
});
console.log(`Listening on port ${PORT}`);
io.listen(PORT);
