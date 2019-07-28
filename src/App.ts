import Game from './Game';
import { JsonBoard } from './interfaces';

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
  const imgSrc: string = 'public/pokemon/index.png'; // TODO: prompt for these
  const boardSrc: any = 'public/pokemon/index.json';
  
  Promise.all([fetchImage(imgSrc), fetchBoard(boardSrc)])
    .then((values) => {
      Game.setup(values[1], ['player1', 'player2'], canvas);
    })
    .catch(err => console.error(err));
}());