import Game from './Game';
import { Position, PlayerEffects, PlayerInput, PlayerColor } from './interfaces';

export const RADIUS = 30;
export const FONT_SIZE = 20;
export const VELO = 12;

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb #noshame
function hexToRgb(hex: string): PlayerColor {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

class Player {
  name: string;
  color: PlayerColor;
  currentPos: Position;
  destinationPos: Position;
  currentTileIndex: number;
  effects: PlayerEffects;
  
  constructor(input: PlayerInput) {
    this.name = input.name;
    this.color = hexToRgb(input.color);
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