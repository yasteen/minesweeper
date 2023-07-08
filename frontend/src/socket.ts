import { io } from "socket.io-client";
const URL =
    process.env.NODE_ENV === "production" ? "" : "http://192.168.1.75:4000";

export const socket = io(URL);
