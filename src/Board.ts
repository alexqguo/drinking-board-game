import Tile from './Tile';
import Player from './Player';
import { createTiles } from './BoardJsonConverter';
import { JsonBoard } from './interfaces';

class Board {
  imgSrc: string;
  tiles: Array<Tile>;
  players: Array<Player>;

  constructor(json: JsonBoard, players: Array<Player>) {
    this.imgSrc = json.imgSrc;
    this.tiles = createTiles(json.tiles);
    this.players = players;
  }
}

export default Board;