import Game from './Game';
import { JsonBoard } from './interfaces';
import { createContext } from 'vm';

/*
fetches the game instance, tells it which source to use and gives it player names
may put an App class in here if necessary
*/
(function() {
  function fetchImage(src: string): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = src;

      img.addEventListener('load', () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.background = `url(${imgSrc})`;
        canvas.style.backgroundSize = '100% 100%';
        resolve();
      });
    });
  }

  function fetchBoard(src: string): Promise<JsonBoard> {
    return new Promise(resolve => {
      fetch(src)
        .then(resp => resp.json())
        .then(data => resolve(data));
    });
  }

  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  const imgSrc: string = 'public/pokemon/index.png'; // TODO: prompt for these
  const boardSrc: any = 'public/pokemon/index.json';
  
  Promise.all([fetchImage(imgSrc), fetchBoard(boardSrc)])
    .then((values) => {
      // Game.setup(values[1], ['player1', 'player2'], canvas);

      // for testing
      ctx.fillStyle = 'red';
      const boardJson = values[1];
      const tilesWithPosition = boardJson.tiles.filter(tile => !!tile.position);
      tilesWithPosition.forEach(tile => {
        tile.position.forEach(pos => {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2, true);
          ctx.fill();
        });
      });

      (window as any).pos = tilesWithPosition[tilesWithPosition.length - 1].position;
      (window as any).getNext = function(x: number) {
        const positions = [];
        for (let i = 1; i <= x; i++) {
          positions.push((window as any).pos.map((p: { x: number; y: any; }) => {
            return {
              x: p.x - ((187 * i) + 2),
              y: p.y
            }
          }));
        }

        console.log(JSON.stringify(positions));
      }
    })
    .catch(err => console.error(err));
}());