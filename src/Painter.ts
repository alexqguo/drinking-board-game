import Game from './Game';
import Player, { RADIUS, FONT_SIZE, VELO } from './Player';
import GameEvents, { MOVE_START, MOVE_END } from './GameEvents';

export default class Painter {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  raf: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    GameEvents.on(MOVE_START, this.draw.bind(this));
  }

  draw(): void {
    this.drawPlayers();
    const x1 = Game.currentPlayer.currentPos.x;
    const y1 = Game.currentPlayer.currentPos.y;
    const x2 = Game.currentPlayer.moveQueue[0].x;
    const y2 = Game.currentPlayer.moveQueue[0].y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const totalDistance = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dx) < VELO && Math.abs(dy) < VELO) { // TODO: fix
      Game.currentPlayer.moveQueue.shift();

      // If the current player (and thus the only one moving) is at its destination,
      // break the raf. If multiple players end up moving at a time this will need updating
      if (!Game.currentPlayer.moveQueue.length) {
        window.cancelAnimationFrame(this.raf);
        GameEvents.trigger(MOVE_END);
      } else if (totalDistance === 0) {
        // If we reached a tile but it wasn't the last one, recalculate the next movement
        // to avoid a frame where the user doesn't move at all
        this.draw();
      }

      return;
    }

    const incrementX = (dx / totalDistance) * VELO;
    const incrementY = (dy / totalDistance) * VELO;
    Game.currentPlayer.currentPos.x += incrementX;
    Game.currentPlayer.currentPos.y += incrementY;
    window.scrollBy(incrementX, incrementY);

    this.raf = window.requestAnimationFrame(this.draw.bind(this));
  }

  drawPlayers(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${FONT_SIZE}px "Open Sans"`;

    for (let i = 0; i < Game.players.length; i++) {
      const player: Player = Game.players[i];
      this.ctx.fillStyle = `rgba(${player.color.r}, ${player.color.g}, ${player.color.b}, 0.7)`;
      this.ctx.beginPath();
      this.ctx.arc(player.currentPos.x, player.currentPos.y, RADIUS, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = 'gray';
      this.ctx.fillText(player.name[0].toUpperCase(), player.currentPos.x - 6, player.currentPos.y + 6);
    }
  }
}