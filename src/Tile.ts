import { Rule } from './rules';
import Player from './Player';
import { Position } from './interfaces';

class Tile {
  displayText: string;
  isMandatory: boolean;
  rule: Rule;
  currentPlayers: Player[];
  coordinates: Position[];
  center: Position;

  constructor(displayText: string, isMandatory: boolean, rule: Rule, coordinates: Position[]) {
    this.displayText = displayText;
    this.isMandatory = isMandatory;
    this.rule = rule;
    this.currentPlayers = [];
    this.coordinates = coordinates;
  }

  placePlayer(player: Player): void {
    this.currentPlayers.push(player);
    player.destinationPos = this.generateCenterPosition();
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