const WS_URL = `ws://${window.location.host}`;

export class RemotePlayer {
  constructor() {
    this.ws = null;
    this.playerSymbol = null;

    // callbacks set by main.js
    this.onWaiting = null;
    this.onGameStart = null;
    this.onStateUpdate = null;
    this.onInvalidMove = null;
    this.onOpponentLeft = null;
    this.onError = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error("WebSocket connection failed"));

      this.ws.onmessage = ({ data }) => {
        let msg;
        try {
          msg = JSON.parse(data);
        } catch {
          return;
        }
        this._handle(msg);
      };

      this.ws.onclose = () => {
        if (this.onOpponentLeft) this.onOpponentLeft();
      };
    });
  }

  _handle(msg) {
    switch (msg.type) {
      case "waiting":
        if (this.onWaiting) this.onWaiting(msg.roomId);
        break;
      case "game_start":
        this.playerSymbol = msg.players[0] === "X" ? "X" : "O";
        // figure out which symbol we are based on join order
        if (this.onGameStart) this.onGameStart(msg.state, this.playerSymbol);
        break;
      case "state_update":
        if (this.onStateUpdate) this.onStateUpdate(msg.state);
        break;
      case "invalid_move":
        if (this.onInvalidMove) this.onInvalidMove(msg.reason);
        break;
      case "opponent_disconnected":
        if (this.onOpponentLeft) this.onOpponentLeft();
        break;
      case "error":
        if (this.onError) this.onError(msg.reason);
        break;
    }
  }

  sendCreate() {
    this._send({ type: "create" });
  }
  sendJoin(roomId) {
    this._send({ type: "join", roomId });
  }
  sendMatchmake() {
    this._send({ type: "matchmake" });
  }
  sendMove(boardIdx, cellIdx) {
    this._send({ type: "move", boardIdx, cellIdx });
  }

  _send(msg) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
