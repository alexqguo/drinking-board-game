import { creatTiles } from './BoardJsonConverter';

class Board {
  constructor(imgSrc, json) {
    this.imgSrc = imgSrc;
    this.tiles = createTiles(json.tiles);
  }
}

export default Board;