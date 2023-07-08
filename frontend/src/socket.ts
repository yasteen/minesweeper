import { io } from "socket.io-client";
const URL =
    //"https://minesweeper.yasteen.repl.co"
    process.env.NODE_ENV === "production" ? "https://minesweeper.yasteen.repl.co" : "http://192.168.1.75:4000";

export const socket = io(URL);
