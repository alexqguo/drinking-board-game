import Board from './Board';
import Player from './Player';
import { JsonBoard } from './interfaces';
import { DiceLink } from './UIHelper';
import GameEvents, { TURN_START, TURN_END, ROLL_START, ROLL_END } from './GameEvents';

class Game {
  static instance: Game;
  board: Board;
  players: Array<Player>;
  currentPlayer: Player;
  turnIndex: number;
  diceLink: DiceLink;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }

    GameEvents.on(TURN_START, this.startTurn.bind(this));
    GameEvents.on(TURN_END, this.endTurn.bind(this));
    GameEvents.on(ROLL_START, this.enableDiceRoll.bind(this));
    GameEvents.on(ROLL_END, this.endDiceRoll.bind(this));

    return Game.instance;
  }

  start(boardSrc: JsonBoard, playerNames: Array<string>, canvas: HTMLCanvasElement): void {
    this.turnIndex = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map((name: string) => new Player(name));
    this.diceLink = new DiceLink('#dice');

    this.players.forEach((p: Player) => p.moveToTile(0));
    GameEvents.trigger(TURN_START);
  }

  startTurn(): void {
    const player = this.players[this.turnIndex % this.players.length];
    this.currentPlayer = player;
    GameEvents.trigger(ROLL_START);

    // this.diceLink.enable(player.name, (roll: number) => {
    //   this.diceLink.disable();
    //   player.moveToTile(player.currentTileIndex + roll);
    // });
  }

  enableDiceRoll(): void {
    this.diceLink.enable(this.currentPlayer.name, (roll: number) => {
      this.diceLink.disable();
      GameEvents.trigger(ROLL_END, [roll]);
    });
  }

  endDiceRoll(roll: number): void {
    this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + roll);
  }

  endTurn(): void {

  }
}

const gameInstance = new Game();

export default gameInstance;