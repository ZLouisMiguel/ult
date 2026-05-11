import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { RoomManager } from "./RoomManager.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const manager = new RoomManager();

app.use(express.static(join(__dirName,"../src")));

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    switch (msg.type) {
      case "create":
        manager.createRoom(ws);
        break;

      case "join":
        manager.joinRoom(ws, msg.roomId);
        break;

      case "matchmake":
        manager.matchmake(ws);
        break;

      case "move": {
        const room = manager.findRoomByPlayer(ws);
        if (room) room.handleMove(ws, msg.boardIdx, msg.cellIdx);
        break;
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    manager.removeFromQueue(ws);

    const room = manager.findRoomByPlayer(ws);
    if (room) {
      room.handleDisconnect(ws);
      if (room.players.length === 0) manager.deleteRoom(room.roomId);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
