import Game from './Game';
import { hexToRgb } from '../utils';
import { Position, PlayerEffects, PlayerInput, PlayerColor } from '../interfaces';

export const RADIUS = 30;
export const FONT_SIZE = 20;
export const VELO = 12;

class Player {
  name: string;
  color: PlayerColor;
  currentPos: Position;
  moveQueue: Position[];
  currentTileIndex: number;
  effects: PlayerEffects;
  custom: Object; // For use by any custom game logic
  
  constructor(input: PlayerInput) {
    this.name = input.name;
    this.color = hexToRgb(input.color);
    this.custom = {};
    this.effects = {
      extraTurns: 0,
      skippedTurns: 0,
      speedModifiers: [],
      customMandatoryTiles: [],
      mandatorySkips: 0,
      moveCondition: null,
      anchors: 0,
    };
  }

  // TODO: consolidate canTakeTurn and isAnchor. bit too lazy to do so right now
  canTakeTurn(): boolean {
    if (this.effects.skippedTurns > 0) {
      this.effects.skippedTurns--;
      return false;
    }

    return true;
  }

  isAnchor(): boolean {
    if (this.effects.anchors > 0) {
      this.effects.anchors--;
      return true;
    }

    return false;
  }

  removeFromCurrentTile() {
    if (typeof this.currentTileIndex === 'number') {
      Game.board.tiles[this.currentTileIndex].currentPlayers.delete(this);
    }
  }

  moveToTile(tileIndex: number) {
    this.moveQueue = [];
    this.removeFromCurrentTile();

    // TODO: need to handle moving backwards? For now just do this
    for (let i = this.currentTileIndex + 1; i <= tileIndex; i++) {
      this.moveQueue.push(Game.board.tiles[i].generateCenterPosition());
    }
    
    this.currentTileIndex = tileIndex;
    Game.board.tiles[tileIndex].currentPlayers.add(this);
  }

  teleportToTile(tileIndex: number) {
    this.removeFromCurrentTile();

    this.currentTileIndex = tileIndex;
    this.currentPos = Game.board.tiles[tileIndex].generateCenterPosition();

    Game.board.tiles[tileIndex].currentPlayers.add(this);
  }
}

export default Player;