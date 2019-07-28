import Board from './Board';
import Player from './Player';
import { JsonBoard } from './interfaces';

class Game {
  static instance: Game;
  board: Board;
  players: Array<Player>;
  turnIndex: number;
  canvas: HTMLCanvasElement;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }
    return Game.instance;
  }

  setup(boardSrc: JsonBoard, playerNames: Array<string>, canvas: HTMLCanvasElement) {
    this.turnIndex = 0;
    this.canvas = canvas;
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map(name => new Player(name));
    Object.freeze(this.players);
  }

  async play() {
    const player = this.players[this.turnIndex % this.players.length];
    const roll = await player.getRoll();
  }

  endTurn() {

  }
}

const gameInstance = new Game();

export default gameInstance;