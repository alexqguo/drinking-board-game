import Game from './Game';
import { Position } from './interfaces';

const RADIUS = 30;
const FONT_SIZE = 20;

class Player {
  name: string;
  currentPos: Position;

  constructor(name: string) {
    this.name = name;
  }

  placeOnBoard(initialPosition: number = 0): void {
    // create canvas element (where?)
    Game.board.tiles[initialPosition].placePlayer(this);
    this.draw();
  }

  draw(): void {
    Game.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    Game.ctx.beginPath();
    Game.ctx.arc(this.currentPos.x, this.currentPos.y, RADIUS, 0, Math.PI * 2, true);
    Game.ctx.fill();

    Game.ctx.fillStyle = 'white';
    Game.ctx.font = `${FONT_SIZE}px "Open Sans"`
    Game.ctx.fillText(this.name[0].toUpperCase(), this.currentPos.x - 6, this.currentPos.y + 6);
  }

  async getRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
}

export default Player;