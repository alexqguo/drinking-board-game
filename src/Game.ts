import Board from './Board';
import Player from './Player';
import { JsonBoard } from './interfaces';
import { DiceLink } from './UIHelper';

class Game {
  static instance: Game;
  board: Board;
  players: Array<Player>;
  turnIndex: number;
  diceLink: DiceLink;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }
    return Game.instance;
  }

  setup(boardSrc: JsonBoard, playerNames: Array<string>, canvas: HTMLCanvasElement): void {
    this.turnIndex = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map((name: string) => new Player(name));
    this.diceLink = new DiceLink('#dice');

    this.players.forEach((p: Player) => p.moveToTile(0));
  }

  play() {
    const player = this.players[this.turnIndex % this.players.length];

    this.diceLink.enable(player.name, (roll: number) => {
      this.diceLink.disable();
      player.moveToTile(player.currentTileIndex + roll);
    });
  }

  endTurn() {

  }
}

const gameInstance = new Game();

export default gameInstance;