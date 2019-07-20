import Tile from './Tile';
import Player from './Player';
import { createTiles } from './BoardJsonConverter';

class Board {
  imgSrc: string;
  tiles: Array<Tile>;
  players: Array<Player>;

  constructor(json: any, players: Array<Player>) { //todo- fix any
    this.imgSrc = json.imgSrc;
    this.tiles = createTiles(json.tiles);
    this.players = players;
  }
}

export default Board;