import Tile from './Tile';
import Zone from './Zone';
import Player from './Player';
import { createTiles, createZones } from './BoardJsonConverter';
import { JsonBoard } from '../interfaces';

class Board {
  imgSrc: string;
  tiles: Tile[];
  zones: Zone[];
  players: Player[];

  constructor(json: JsonBoard, players: Array<Player>) {
    this.imgSrc = json.imgSrc;
    this.tiles = createTiles(json.tiles);
    this.zones = createZones(json.zones);
    this.players = players;
  }
}

export default Board;