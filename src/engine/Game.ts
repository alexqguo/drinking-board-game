import Zone from './Zone';
import Board from './Board';
import Player from './Player';
import { JsonBoard, PlayerInput, ZoneType, TurnIncrementer } from '../interfaces';
import Painter from './Painter';
import { Modal } from './Modal';
import GameEvents, { 
  TURN_START, TURN_END, ROLL_START, ROLL_END, MOVE_END, RULE_TRIGGER, MOVE_START, RULE_END, 
  LOST_TURN_START, GAME_START
} from './GameEvents';
import Tile from './Tile';
import { DiceRoll } from '../components/DiceRoll';

class Game {
  static instance: Game;
  board: Board;
  players: Player[];
  currentPlayer: Player;
  turnPosition: number;
  diceLink: HTMLElement;
  freeRollDiceLink: DiceRoll;
  modal: Modal;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  painter: Painter;
  turnIncrementer: TurnIncrementer;

  constructor() {
    if (!Game.instance) {
      Game.instance = this;
    }

    GameEvents.on(GAME_START, this.startGame.bind(this));
    GameEvents.on(LOST_TURN_START, this.startLostTurn.bind(this));
    GameEvents.on(TURN_START, this.startTurn.bind(this));
    GameEvents.on(TURN_END, this.endTurn.bind(this));
    GameEvents.on(ROLL_START, this.enableDiceRoll.bind(this));
    GameEvents.on(ROLL_END, this.endDiceRoll.bind(this));
    GameEvents.on(MOVE_END, this.endMovement.bind(this));
    GameEvents.on(RULE_TRIGGER, this.triggerRule.bind(this));
    GameEvents.on(RULE_END, this.endRule.bind(this));

    GameEvents.on(MOVE_END, this.updatePlayerStatusElement.bind(this));
    GameEvents.on(RULE_TRIGGER, this.updatePlayerStatusElement.bind(this));

    return Game.instance;
  }

  init(boardSrc: JsonBoard, playerNames: PlayerInput[], canvas: HTMLCanvasElement): void {
    this.turnPosition = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new Board(boardSrc, this.players);
    this.players = playerNames.map((p: PlayerInput) => new Player(p));
    this.diceLink = document.querySelector('#overlay dice-roll');
    this.freeRollDiceLink = document.querySelector('#overlay .free-roll');
    this.modal = new Modal();
    this.painter = new Painter(this.canvas, this.ctx);

    this.players.forEach((p: Player) => p.teleportToTile(0));
    this.painter.drawPlayers();
    this.handleDiceRoll = this.handleDiceRoll.bind(this);
    this.turnIncrementer = TurnIncrementer.normal;

    // TODO - this should be more organized. need to enable the link only sometimes
    document.querySelector('#skip a').addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.diceLink.removeEventListener('roll', this.handleDiceRoll); // hacky
      GameEvents.trigger(TURN_END);
      return false;
    });

    GameEvents.trigger(GAME_START);
  }

  startGame(next: Function) {
    GameEvents.trigger(TURN_START);
    next();
  }

  startTurn(next: Function): void {
    const pos = this.turnPosition;
    const length = this.players.length;
    // Loop the turnPosition around to find the current player
    const playerIndex = (pos < 0 ? length - (-pos % length) : pos) % length;
    this.currentPlayer = this.players[playerIndex];

    this.updatePlayerStatusElement();
    const canMove = this.currentPlayer.canTakeTurn();
    this.freeRollDiceLink.reset();
    
    window.scrollTo({
      top: this.currentPlayer.currentPos.y - (window.outerHeight / 2),
      left: this.currentPlayer.currentPos.x - (window.outerWidth / 2),
      behavior: 'smooth',
    });

    if (canMove) {
      const currentZone: Zone = this.getCurrentZone();

      if (currentZone && currentZone.type === ZoneType.active) {
        currentZone.rule.execute(() => {
          /**
           * Need to check this again in case the zone made the player lose a turn.
           * If we even acted on a zone to begin with it means the player could take their turn (skippedTurns was 0)
           * so there's no harm in checking again.
           */
          GameEvents.trigger(this.currentPlayer.canTakeTurn() ? ROLL_START : TURN_END);
        });
      } else {
        GameEvents.trigger(ROLL_START);
      }
    } else {
      GameEvents.trigger(LOST_TURN_START);
    }
  }

  startLostTurn(): void {
    // Basically just wait a couple seconds so the user can be reminded that they aren't allowed to do anything
    setTimeout(() => {
      GameEvents.trigger(TURN_END);
    }, 1200);
  }

  enableDiceRoll(next: Function): void {
    (this.diceLink as any).reset(); // TODO: just import the component?
    this.diceLink.addEventListener('roll', this.handleDiceRoll);
    next();
  }

  handleDiceRoll(e: CustomEvent): void {
    const roll = e.detail.roll;
    GameEvents.trigger(ROLL_END, [roll]);
    this.diceLink.removeEventListener('roll', this.handleDiceRoll);
  }

  endDiceRoll(next: Function, roll: number): void {
    if (this.currentPlayer.effects.moveCondition) {
      const canMove = this.currentPlayer.effects.moveCondition(roll);

      if (!canMove) {
        // So that it doesn't jump immediately. Not sure of a good way to do this right now.
        setTimeout(() => {
          this.modal.close();
          GameEvents.trigger(TURN_END);
        }, 1200);
        next();
        return;
      }
    }

    if (this.currentPlayer.effects.speedModifiers.length) {
      const modifier: Function = this.currentPlayer.effects.speedModifiers.shift().fn;
      roll = modifier(roll);
    }

    // Check for mandatory spaces
    let firstMandatoryIndex = this.board.tiles
      .slice(this.currentPlayer.currentTileIndex + 1, this.currentPlayer.currentTileIndex + 1 + roll)
      .findIndex((tile: Tile) => {
        return tile.isMandatory || 
          this.currentPlayer.effects.customMandatoryTiles.includes(tile.tileIndex) ||
          [...tile.currentPlayers].find((p: Player) => p.isAnchor());
      });

    if (this.currentPlayer.effects.mandatorySkips > 0 && firstMandatoryIndex !== -1) {
      this.currentPlayer.effects.mandatorySkips--;
      firstMandatoryIndex = -1;
    }

    let numSpacesToAdvance: number = (firstMandatoryIndex === -1 ? roll : firstMandatoryIndex + 1);
    
    // Uncomment this section for testing
    if (this.currentPlayer.name === 'asdf' && !(window as any).asdf) {
      numSpacesToAdvance = 49;
      (window as any).asdf = true;
    }

    if (numSpacesToAdvance > 0) {
      // Consider fixing this naming. This doesn't actually move anything in the UI
      this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + numSpacesToAdvance);
      GameEvents.trigger(MOVE_START);
    }

    next();
  }

  endMovement(next: Function): void {
    GameEvents.trigger(RULE_TRIGGER);
    next();
  }

  triggerRule(next: Function): void {
    const currentTile = this.board.tiles[this.currentPlayer.currentTileIndex];
    const currentRule = currentTile.rule;
    currentRule.execute(); // currentRule.execute() should trigger rule end
    next();
  }

  endRule(next: Function): void {
    next();
    GameEvents.trigger(TURN_END);
  }

  endTurn(next: Function): void {
    // Don't increment turnPosition if the player has an extra turn
    if (this.currentPlayer.effects.extraTurns > 0) {
      this.currentPlayer.effects.extraTurns--;
    } else {
      this.turnPosition += this.turnIncrementer;
    }

    GameEvents.trigger(TURN_START);
    next();
  }

  gameOver(): void {
    alert(`Game over!\n\n Winner: ${this.currentPlayer.name}`);
  }

  getInactivePlayers(): Player[] {
    return this.players.filter((p: Player) => {
      return p !== this.currentPlayer;
    });
  }

  getCurrentZone(): Zone {
    const currentTile: Tile = this.board.tiles[this.currentPlayer.currentTileIndex];
    if (currentTile.zone) {
      return this.board.zones.find((zone: Zone) => zone.name === currentTile.zone);
    }

    return null;
  }

  // This will go away with state management as the element can just listen for changes
  updatePlayerStatusElement(next: Function = () => {}): void {
    // TODO: should tell the user what the actual move condition is instead of just that they have one at all
    const jsonReplacer = (key: string, value: string) => {
      return (typeof value === 'function' ? true : value);
    };

    // TODO: consider saving this, it isn't changing
    const currentZone: Zone = this.getCurrentZone();
    const playerStatusEl: HTMLElement = document.querySelector('#overlay player-status');
    const args: Object = { 
      name: this.currentPlayer.name, 
      effects: this.currentPlayer.effects,
      ...(currentZone && { zoneName: currentZone.name }),
      custom: this.currentPlayer.custom,
    };
    playerStatusEl.setAttribute('data', JSON.stringify(args, jsonReplacer));

    next();
  }
}

const gameInstance = new Game();

export default gameInstance;