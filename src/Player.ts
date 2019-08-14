import Game from './Game';
import { Position } from './interfaces';

export const RADIUS = 30;
export const FONT_SIZE = 20;
export const VELO = 12;

class Player {
  name: string;
  currentPos: Position;
  destinationPos: Position;
  currentTileIndex: number;
  // TODO: consider puttting the following into a containing "effects" map or list
  skippedTurns: number;
  speedModifiers: number[];
  moveConditions: Function[];
  
  constructor(name: string) {
    this.name = name;
    this.skippedTurns = 0;
    this.speedModifiers = [];
    this.moveConditions = [];
  }

  canTakeTurn(): boolean {
    if (this.skippedTurns > 0) {
      this.skippedTurns--;
      return false;
    }

    return true;
  }

  moveToTile(tileIndex: number = 0) {
    this.currentTileIndex = tileIndex;
    Game.board.tiles[tileIndex].placePlayer(this);

    if (!this.currentPos && this.destinationPos) {
      this.currentPos = this.destinationPos;
    }
  }
}

export default Player;