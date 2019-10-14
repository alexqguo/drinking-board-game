import { Rule } from '../rules';
import Player from './Player';
import { Position } from '../interfaces';

class Tile {
  isMandatory: boolean;
  rule: Rule;
  coordinates: Position[];
  center: Position;
  zone: string;
  currentPlayers: Set<Player>;
  tileIndex: number;

  constructor(isMandatory: boolean, rule: Rule, coordinates: Position[], zone: string, tileIndex: number) {
    this.isMandatory = isMandatory;
    this.rule = rule;
    this.coordinates = coordinates;
    this.zone = zone;
    this.currentPlayers = new Set();
    this.tileIndex = tileIndex;
  }

  // Generates an average position based on the corners of the tile
  // Can consider making it slightly offset if a player is already there
  generateCenterPosition(): Position {
    const total: Position = this.coordinates.reduce((prev: Position, cur: Position) => {
      return {x: prev.x + cur.x, y: prev.y + cur.y};
    }, {x: 0, y: 0});
    total.x /= this.coordinates.length;
    total.y /= this.coordinates.length;

    return total;
  }
}

export default Tile;