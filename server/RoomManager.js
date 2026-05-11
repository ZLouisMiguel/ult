import { GameRoom } from "./GameRoom.js";

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.matchMakeQueue = null;
  }

  createRoom(ws) {
    let roomId;
    do {
      roomId = generateCode();
    } while (this.rooms.has(roomId));

    const room = new GameRoom(roomId);
    this.rooms.set(roomId, room);
    room.addPlayer(ws);
  }

  joinRoom(ws, roomId) {
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({ type: "error", reason: "Room not found" }));
      return null;
    }

    if (room.isFull) {
      ws.send(JSON.stringify({ type: "error", reason: "Room is full" }));
      return null;
    }
    room.addPlayer(ws);
    return room;
  }

  matchMake(ws) {
    if(this.matchMakeQueue && this.matchMakeQueue.readyState === 1) {
        const room = this.createRoom(this.matchMakeQueue);
        this.matchMakeQueue = null;
        room.addPlayer(ws);
        return room;
    }else {
        this.matchMakeQueue = ws;
        return this.createRoom(ws);
    }
  }

  removeFromQueue(ws) {
    if(this.matchMakeQueue === ws) this.matchMakeQueue = null;
  }

  findRoomByPlayer(ws) {
    for(const room of this.rooms.values()) {
        if(room.players.some((p)=> p.ws === ws)) return room;
    }
    return null;
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
  }
}
