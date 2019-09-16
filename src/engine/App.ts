import Game from './Game';
import GameEvents, * as events from './GameEvents';
import { JsonBoard, PlayerInput } from '../interfaces';

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

function fetchScript(src: string): Promise<void> {
  return new Promise(resolve => {
    const tag: HTMLScriptElement = document.createElement('script');
    tag.setAttribute('src', src);
    document.body.appendChild(tag);
    tag.addEventListener('load', () => {
      resolve();
    });
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
  const boardSrc: string = `${boardPrefix}/index.json`;
  const scriptSrc: string = `${boardPrefix}/index.js`;
  
  Promise.all([fetchBoard(boardSrc), fetchImage(imgSrc, canvas), fetchScript(scriptSrc)])
    .then((values) => {
      Game.init(values[0], players, canvas); // values[0] is the result of the fetchBoard promise
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
  if (!gameSetupInfo[1].length || gameSetupInfo[1].length < 2) {
    alert('You need at least two players to play this game');
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

// Export of the application
export {
  Game,
  GameEvents,
  events,
};