import Game from './Game';
import Player, { RADIUS, FONT_SIZE, VELO } from './Player';
import GameEvents, { MOVE_START, MOVE_END } from './GameEvents';

// TODO: fix this file, it's shit

export class DiceLink {
  link: HTMLAnchorElement;
  resultContainer: HTMLSpanElement;
  rollText: string;
  rollCallback: Function;

  constructor(selector: string) {
    this.link = document.querySelector(`${selector} a`);
    this.resultContainer = document.querySelector(`${selector} span`);
    this.rollText = this.link.innerText;

    this.link.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const roll = Math.floor(Math.random() * 6) + 1;

      this.resultContainer.innerText = '' + roll;

      if (this.rollCallback) {
        this.rollCallback(roll);
      }
      return false;
    });
  }

  enable(playerName: string, callback: Function) {
    this.link.style.fontWeight = 'bold';
    this.link.innerText = `${playerName} - ${this.rollText}`;
    this.link.dataset.playerTarget = playerName;
    this.rollCallback = callback;
  }

  disable() {
    this.link.style.fontWeight = 'normal';
    this.link.innerText = this.rollText;
    this.link.dataset.playerTarget = null;
    this.rollCallback = null;
    // this.resultContainer.innerText = '';
  }
}

export class Painter {
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
    const x2 = Game.currentPlayer.destinationPos.x;
    const y2 = Game.currentPlayer.destinationPos.y;
    const dx = x2 - x1;
    const dy = y2 - y1;

    // If the current player (and thus the only one moving) is at its destination,
    // break the raf. If multiple players end up moving at a time this will need updating
    if (Math.abs(dx) < VELO && Math.abs(dy) < VELO) { // TODO: fix
      window.cancelAnimationFrame(this.raf);
      GameEvents.trigger(MOVE_END);
      return;
    }

    const totalDistance = Math.sqrt(dx * dx + dy * dy);
    Game.currentPlayer.currentPos.x += (dx / totalDistance) * VELO;
    Game.currentPlayer.currentPos.y += (dy / totalDistance) * VELO;

    this.raf = window.requestAnimationFrame(this.draw.bind(this));
  }

  drawPlayers(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // TODO: need to also draw the other players back in when this happens
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.font = `${FONT_SIZE}px "Open Sans"`;

    for (let i = 0; i < Game.players.length; i++) {
      const player: Player = Game.players[i];
      this.ctx.beginPath();
      this.ctx.arc(player.currentPos.x, player.currentPos.y, RADIUS, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = 'white';
      this.ctx.fillText(player.name[0].toUpperCase(), player.currentPos.x - 6, player.currentPos.y + 6);
    }
  }
}