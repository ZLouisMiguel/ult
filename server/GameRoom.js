import {
  createInitialState,
  validateMove,
  applyMove,
} from "../src/js/engine.js";

export class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = [];
    this.state = createInitialState();
    this.started = false;
  }

  get isFull() {
    return this.players.length === 2;
  }

  addPlayer(ws) {
    const symbol = this.players.length === 0 ? "X" : "O";
    this.players.push({ ws, player: symbol });

    if (this.isFull) {
      this.started = true;
      this.broadcast({
        type: "game_start",
        state: this.state,
        players: this.players.map((p) => p.player),
      });
    } else {
      this.send(ws, { type: "waiting", roomId: this.roomId });
    }

    return symbol;
  }

  handleMove(ws, boardIdx, cellIdx) {
    const sender = this.players.find((p) => p.ws === ws);
    if (!sender) return;

    if (sender.player !== this.state.currentPlayer) {
      this.send(ws, { type: "invalid_move", reason: "it's not your turn yet" });
      return;
    }

    const { valid, reason } = validateMove(this.state, boardIdx, cellIdx);
    if (!valid) {
      this.send(ws, { type: "invalid_move", reason });
      return;
    }

    this.state = applyMove(this.state, boardIdx, cellIdx);
    this.broadcast({ type: "state_update", state: this.state });
  }

  handleDisconnect(ws) {
    const leaver = this.players.find((p) => p.ws === ws);
    if (!leaver) return;

    this.players = this.players.filter((p) => p.ws !== ws);
    this.broadcast({
      type: "opponent_disconnected",
      player: leaver.player,
    });
  }

  send(ws, message) {
    if (ws.readyState === 1) ws.send(JSON.stringify(message));
  }

  broadcast(message) {
    this.players.forEach(({ ws }) => this.send(ws, message));
  }
}
