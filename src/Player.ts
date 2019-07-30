import Game from './Game';
import { Position } from './interfaces';

const RADIUS = 30;
const FONT_SIZE = 20;
const VELO = 6;
let raf: number;

class Player {
  name: string;
  currentPos: Position;
  destinationPos: Position;
  currentTileIndex: number;

  constructor(name: string) {
    this.name = name;
  }

  moveToTile(tileIndex: number = 0) {
    this.currentTileIndex = tileIndex;
    // TODO: check for mandatory spaces
    Game.board.tiles[tileIndex].placePlayer(this);
    if (!this.currentPos && this.destinationPos) {
      this.currentPos = this.destinationPos;
    }
    this.draw();
  }

  // Should be static? need to persist the other players when moving one of them, can't clear the entire canvas
  draw(): void {
    // if at destination, cancel frame and return
    // console.log('drawing');
    // console.log(this.currentPos.y)
    // console.log(this.destinationPos.y);
    // console.log('\n');

    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height); // TODO: need to also draw the other players back in when this happens
    Game.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    Game.ctx.beginPath();
    Game.ctx.arc(this.currentPos.x, this.currentPos.y, RADIUS, 0, Math.PI * 2, true);
    Game.ctx.closePath();
    Game.ctx.fill();

    Game.ctx.fillStyle = 'white';
    Game.ctx.font = `${FONT_SIZE}px "Open Sans"`
    Game.ctx.fillText(this.name[0].toUpperCase(), this.currentPos.x - 6, this.currentPos.y + 6);

    // TODO: do a proper check to see if we have arrived
    if (this.currentPos.y <= this.destinationPos.y) {
      window.cancelAnimationFrame(raf);
      return;
    }
    this.currentPos.y -= VELO;
    raf = window.requestAnimationFrame(this.draw.bind(this));
  }
}

export default Player;