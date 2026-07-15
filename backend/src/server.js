import "dotenv/config";
import http from "http";

import app from "./app.js";
import { initializeSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log("===================================");
  console.log(`🚀 Server running on Port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("⚡ Socket.IO initialized");
  console.log("===================================");
});