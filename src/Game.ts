import Board from './Board';
import Player from './Player';
import { Rule } from './rules';
import { JsonBoard } from './interfaces';
import Painter from './Painter';
import { DiceLink } from './UIHelper';
import GameEvents, { 
  TURN_START, TURN_END, ROLL_START, ROLL_END, MOVE_END, RULE_TRIGGER, MOVE_START
} from './GameEvents';
import Tile from './Tile';

class Game {
  static instance: Game;
  board: Board;
  players: Player[];
  playerTurns: Player[];
  currentPlayer: Player;
  turnIndex: number;
  diceLink: DiceLink;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  painter: Painter;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }

    GameEvents.on(TURN_START, this.startTurn.bind(this));
    GameEvents.on(TURN_END, this.endTurn.bind(this));
    GameEvents.on(ROLL_START, this.enableDiceRoll.bind(this));
    GameEvents.on(ROLL_END, this.endDiceRoll.bind(this));
    GameEvents.on(MOVE_END, this.endMovement.bind(this));
    GameEvents.on(RULE_TRIGGER, this.triggerRule.bind(this));

    return Game.instance;
  }

  start(boardSrc: JsonBoard, playerNames: Array<string>, canvas: HTMLCanvasElement): void {
    this.turnIndex = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map((name: string) => new Player(name));
    this.diceLink = new DiceLink('#dice');
    this.painter = new Painter(this.canvas, this.ctx);

    this.players.forEach((p: Player) => p.moveToTile(0));
    this.playerTurns = [...this.players];
    this.painter.drawPlayers();

    GameEvents.trigger(TURN_START);
  }

  startTurn(): void {
    // Restart at the beginning 
    if (!this.playerTurns.length) this.playerTurns = [...this.players];

    this.currentPlayer = this.playerTurns.shift();
    GameEvents.trigger(ROLL_START);
  }

  enableDiceRoll(next: Function): void {
    this.diceLink.enable(this.currentPlayer.name, (roll: number) => {
      this.diceLink.disable();
      GameEvents.trigger(ROLL_END, [roll]);
      next();
    });
  }

  endDiceRoll(next: Function, roll: number): void {
    // Check for mandatory spaces
    const firstMandatoryIndex = this.board.tiles
      .slice(this.currentPlayer.currentTileIndex + 1, this.currentPlayer.currentTileIndex + 1 + roll)
      .findIndex((tile: Tile) => {
        return tile.isMandatory;
      });
    const numSpacesToAdvance: number = (firstMandatoryIndex === -1 ? roll : firstMandatoryIndex + 1);
    
    // uncomment this line for testing
    // const numSpacesToAdvance: number = 2;

    // todo- fix this naming. this doesn't actually move anything in the UI
    this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + numSpacesToAdvance);
    GameEvents.trigger(MOVE_START);
    next();
  }

  endMovement(next: Function): void {
    GameEvents.trigger(RULE_TRIGGER);
  }

  triggerRule(next: Function): void {
    const currentTile = this.board.tiles[this.currentPlayer.currentTileIndex];
    const currentRule = currentTile.rule;
    console.log(currentTile);
    if (currentRule) currentRule.execute(); // TODO - remove if check, it's just to not NPE on the placeholders
    next();
    GameEvents.trigger(TURN_END);
  }

  endTurn(next: Function): void {
    next();
    this.turnIndex++;
    GameEvents.trigger(TURN_START);
  }

  gameOver(): void {
    alert(`Game over!\n\n Winner: ${this.currentPlayer.name}`);
  }
}

const gameInstance = new Game();

export default gameInstance;