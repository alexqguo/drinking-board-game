import Game from './Game';
import { JsonBoard, PlayerInput } from './interfaces';

/*
fetches the game instance, tells it which source to use and gives it player names
may put an App class in here if necessary
*/
(function() {
  (window as any).g = Game; // TODO: remove

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

  // Got lazy with this. Create an actual TS interface
  function getFormValues(): [string, PlayerInput[]] {
    const formData: PlayerInput[] = [];
    const boardPrefix = (document.getElementById('game') as HTMLInputElement).value;
    const players = Array.from(document.querySelectorAll('#player-input input[type="text"]'))
      .filter((input: HTMLInputElement) => !!input.value)
      .map((input: HTMLInputElement) => input.value);
    const colors = Array.from(document.querySelectorAll('#player-input input[type="color"]'))
      .filter((input: HTMLInputElement) => !!input.value)
      .map((input: HTMLInputElement) => input.value);

    players.forEach((name: string, idx: number) => {
      const color = colors[idx] || '#000000';
      formData.push({ name, color });
    });

    return [boardPrefix, formData];
  }

  function initGame(boardPrefix: string, players: PlayerInput[]): void {
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
    const input: HTMLElement = document.createElement('player-input');
    frag.appendChild(input);
    document.getElementById('player-input').appendChild(frag);
    return false;
  });

  document.getElementById('setup').addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const gameSetupInfo: [string, PlayerInput[]] = getFormValues();

    // Make sure there are players
    if (!gameSetupInfo[1].length) {
      alert('You need players to play this game');
      return;
    }

    // Make sure the names are unique
    const names = gameSetupInfo[1].map((val: PlayerInput) => val.name);
    if (new Set(names).size < gameSetupInfo[1].length) {
      alert('Player names must be unique');
      return;
    }

    initGame(gameSetupInfo[0], gameSetupInfo[1]);
    document.getElementById('setup').style.display = 'none';
    document.getElementById('overlay').style.display = 'block';
  });
}());