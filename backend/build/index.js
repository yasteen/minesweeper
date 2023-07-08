"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const board_1 = require("./board");
const PORT = 4000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>");
});
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
const connectionOptions = {
    cors: { origin: ["https://minesweeper.yasteen.com"] }
};
if (process.env.NODE_ENV === "dev") {
    connectionOptions.cors.origin = [...connectionOptions.cors.origin, "http://192.168.1.75:3000", "http://localhost:3000"];
}
const io = new socket_io_1.Server(server, connectionOptions);
const hoverState = {};
io.on("connection", (socket) => {
    console.log(`Hello there ${socket.id}`);
    hoverState[socket.id] = -1;
    socket.join("default");
    socket.emit("receiveBoard", board_1.boards["default"]);
    socket.emit("hoverState", hoverState);
    socket.on("uncover", (index) => {
        (0, board_1.uncover)("default", index);
        io.to("default").emit("receiveBoard", board_1.boards["default"]);
    });
    socket.on("flag", (index) => {
        (0, board_1.flag)("default", index);
        io.to("default").emit("receiveBoard", board_1.boards["default"]);
    });
    socket.on("hover", (index) => {
        hoverState[socket.id] = index;
        io.to("default").emit("hoverState", hoverState);
    });
    socket.on("reset", () => {
        board_1.boards["default"] = (0, board_1.createEmptyBoard)();
        io.to("default").emit("receiveBoard", board_1.boards["default"]);
    });
    socket.on("disconnect", () => {
        if (socket.id in hoverState)
            delete hoverState[socket.id];
    });
});
