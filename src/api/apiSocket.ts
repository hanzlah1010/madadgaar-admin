// socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env?.VITE_SOCKET_BASE_URL, {
  withCredentials: true,
  transports: ["websocket"], // Optional, but good for forcing WebSocket
});

export default socket;

