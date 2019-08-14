import Board from './Board';
import Player from './Player';
import { JsonBoard } from './interfaces';
import Painter from './Painter';
import { Modal } from './Modal';
import GameEvents, { 
  TURN_START, TURN_END, ROLL_START, ROLL_END, MOVE_END, RULE_TRIGGER, MOVE_START, RULE_END
} from './GameEvents';
import Tile from './Tile';

class Game {
  static instance: Game;
  board: Board;
  players: Player[];
  playerTurns: Player[];
  currentPlayer: Player;
  turnIndex: number;
  diceLink: HTMLElement;
  modal: Modal;
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
    GameEvents.on(RULE_END, this.endRule.bind(this));

    return Game.instance;
  }

  start(boardSrc: JsonBoard, playerNames: Array<string>, canvas: HTMLCanvasElement): void {
    this.turnIndex = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map((name: string) => new Player(name));
    this.diceLink = document.querySelector('#overlay dice-roll');
    this.modal = new Modal();
    this.painter = new Painter(this.canvas, this.ctx);

    this.players.forEach((p: Player) => p.moveToTile(0));
    this.playerTurns = [...this.players];
    this.painter.drawPlayers();

    // TODO - this should be more organized. need to enable the link only sometimes
    document.querySelector('#skip a').addEventListener('click', (e: Event) => {
      e.preventDefault();
      GameEvents.trigger(TURN_END);
      return false;
    });

    GameEvents.trigger(TURN_START);
  }

  startTurn(): void {
    // Restart at the beginning 
    if (!this.playerTurns.length) this.playerTurns = [...this.players];

    this.currentPlayer = this.playerTurns.shift();
    GameEvents.trigger(this.currentPlayer.canTakeTurn() ? ROLL_START : TURN_END);
    document.querySelector('#overlay h4').innerHTML = this.currentPlayer.name;
    
    window.scrollTo({
      top: this.currentPlayer.currentPos.y - (window.outerHeight / 2),
      left: this.currentPlayer.currentPos.x - (window.outerWidth / 2),
      behavior: 'smooth'
    });
  }

  enableDiceRoll(next: Function): void {
    const handleRoll = (e: CustomEvent) => {
      const roll = e.detail.roll;
      GameEvents.trigger(ROLL_END, [roll]);
      next();
      this.diceLink.removeEventListener('roll', handleRoll);
    }

    (this.diceLink as any).reset(); // TODO: just import the component?
    this.diceLink.addEventListener('roll', handleRoll);
  }

  endDiceRoll(next: Function, roll: number): void {
    // TODO: check move condition
    if (this.currentPlayer.moveCondition) {
      const canMove = this.currentPlayer.moveCondition(roll);

      if (!canMove) {
        // So that it doesn't jump immediately. Not sure of a good way to do this right now.
        setTimeout(() => {
          GameEvents.trigger(TURN_END);
        }, 2000);
        next();
        return;
      }
    }

    if (this.currentPlayer.speedModifiers.length) {
      const modifier: number = this.currentPlayer.speedModifiers.shift();
      roll = Math.ceil(modifier * roll); // TODO - may not always be multiplication
    }

    // Check for mandatory spaces
    const firstMandatoryIndex = this.board.tiles
      .slice(this.currentPlayer.currentTileIndex + 1, this.currentPlayer.currentTileIndex + 1 + roll)
      .findIndex((tile: Tile) => {
        return tile.isMandatory;
      });
    let numSpacesToAdvance: number = (firstMandatoryIndex === -1 ? roll : firstMandatoryIndex + 1);
    
    // uncomment this line for testing
    if (this.currentPlayer.name === 'asdf') numSpacesToAdvance = 8;
    // if (this.currentPlayer.name === 'blah') numSpacesToAdvance = 25;

    if (numSpacesToAdvance > 0) {
      // todo- fix this naming. this doesn't actually move anything in the UI
      this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + numSpacesToAdvance);
      GameEvents.trigger(MOVE_START);
    }

    next();
  }

  endMovement(next: Function): void {
    GameEvents.trigger(RULE_TRIGGER);
  }

  triggerRule(next: Function): void {
    const currentTile = this.board.tiles[this.currentPlayer.currentTileIndex];
    const currentRule = currentTile.rule;
    // TODO - remove if check, it's just to not NPE on the placeholders
    if (currentRule) currentRule.execute();
    // currentRule.execute() should trigger rule end
    next();
  }

  endRule(next: Function): void {
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

  getInactivePlayers(): Player[] {
    return this.players.filter((p: Player) => {
      return p !== this.currentPlayer;
    });
  }
}

const gameInstance = new Game();

export default gameInstance;