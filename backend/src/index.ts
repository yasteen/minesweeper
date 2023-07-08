import { Server } from "socket.io";
import { boards, createEmptyBoard, flag, uncover } from "./board";

const PORT = 4000;

const connectionOptions = process.env.NODE_ENV === "dev" ? {
    cors: { origin: ["http://192.168.1.75:3000", "http://localhost:3000"] }
} : {};
const io = new Server(connectionOptions);

const hoverState: {[id: string]: number} = {};

io.on("connection", (socket) => {
    console.log(`Hello there ${socket.id}`);
    hoverState[socket.id] = -1;

    socket.join("default");
    socket.emit("receiveBoard", boards["default"]);
    socket.emit("hoverState", hoverState);

    socket.on("uncover", (index: number) => {
        uncover("default", index);
        io.to("default").emit("receiveBoard", boards["default"]);
    });
    socket.on("flag", (index: number) => {
        flag("default", index);
        io.to("default").emit("receiveBoard", boards["default"]);
    });
    socket.on("hover", (index: number) => {
        hoverState[socket.id] = index;
        io.to("default").emit("hoverState", hoverState);
    });
    socket.on("reset", () => {
        boards["default"] = createEmptyBoard();
        io.to("default").emit("receiveBoard", boards["default"]);
    });

    socket.on("disconnect", () => {
        if (socket.id in hoverState) delete hoverState[socket.id];
    })
});

console.log(`Listening on port ${PORT}`)
io.listen(PORT);
