import Game from './Game';
import { Position, PlayerEffects } from './interfaces';

export const RADIUS = 30;
export const FONT_SIZE = 20;
export const VELO = 12;

class Player {
  name: string;
  currentPos: Position;
  destinationPos: Position;
  currentTileIndex: number;
  effects: PlayerEffects;
  
  constructor(name: string) {
    this.name = name;
    this.effects = {
      extraTurns: 0,
      skippedTurns: 0,
      speedModifiers: [],
      mandatorySkips: 0,
      moveCondition: null,
    };
  }

  canTakeTurn(): boolean {
    if (this.effects.skippedTurns > 0) {
      this.effects.skippedTurns--;
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