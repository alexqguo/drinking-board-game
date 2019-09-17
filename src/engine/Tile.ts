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

  constructor(isMandatory: boolean, rule: Rule, coordinates: Position[], zone: string) {
    this.isMandatory = isMandatory;
    this.rule = rule;
    this.coordinates = coordinates;
    this.zone = zone;
    this.currentPlayers = new Set();
  }

  // Generates an average position based on the corners of the tile
  // TODO: change this when someone is already at this space
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