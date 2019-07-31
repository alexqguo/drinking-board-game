import Game from './Game';
import { JsonBoard } from './interfaces';

/*
fetches the game instance, tells it which source to use and gives it player names
may put an App class in here if necessary
*/
(function() {
  function fetchImage(src: string, canvas: HTMLCanvasElement): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = src;

      img.addEventListener('load', () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.background = `url(${src})`;
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

  function getFormValues(): [string, string[]] {
    const boardPrefix = (document.getElementById('game') as HTMLInputElement).value;
    const players = Array.from(document.querySelectorAll('#player-input input'))
      .filter((input: HTMLInputElement) => !!input.value)
      .map((input: HTMLInputElement) => input.value);

    return [boardPrefix, players];
  }

  function initGame(boardPrefix: string, players: string[]): void {
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const imgSrc: string = `${boardPrefix}/index.png`;
    const boardSrc: any = `${boardPrefix}/index.json`;
    
    Promise.all([fetchImage(imgSrc, canvas), fetchBoard(boardSrc)])
      .then((values) => {
        Game.start(values[1], players, canvas); // values[1] is the result of the fetchBoard promise
      })
      .catch(err => console.error(err));
  }

  document.getElementById('add-player').addEventListener('click', (e: Event) => {
    e.preventDefault();
    const frag: DocumentFragment = document.createDocumentFragment();
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'text';
    frag.appendChild(input);
    document.getElementById('player-input').appendChild(frag);
    return false;
  });

  document.getElementById('setup').addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const gameSetupInfo: [string, string[]] = getFormValues();

    if (!gameSetupInfo[1].length) {
      alert('You need players to play this game');
      return;
    }

    initGame(gameSetupInfo[0], gameSetupInfo[1]);
    document.getElementById('setup').style.display = 'none';
    document.getElementById('overlay').style.display = 'block';
  });
}());