import Board from './Board';
import Player from './Player';
import { JsonBoard } from './interfaces';

class Game {
  static instance: Game;
  board: Board;
  players: Array<Player>;
  turnIndex: number;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }
    return Game.instance;
  }

  setup(boardSrc: string, playerNames: Array<string>) {
    this.turnIndex = 0;
    this.players = playerNames.map(name => new Player(name));
    Object.freeze(this.players);

    const boardJson: JsonBoard = require(boardSrc);
    this.board = new Board(boardJson, this.players);
  }

  async play() {
    const player = this.players[this.turnIndex % this.players.length];
    const roll = await player.getRoll();
  }

  endTurn() {

  }
}

const gameInstance = new Game();
Object.freeze(gameInstance);

export default gameInstance;