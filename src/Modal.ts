import Game from './Game';
import Player from './Player';

// TODO: stencil
export class Modal {
  triggerId: string;
  trigger: HTMLInputElement;
  controls: HTMLLabelElement[];
  header: HTMLHeadingElement;
  content: HTMLElement;
  closeCb: Function;

  constructor() {
    this.triggerId = 'game-modal';
    this.trigger = document.querySelector(`#${this.triggerId}`);
    this.controls = Array.from(document.querySelectorAll('label[for="game-modal"]'));
    this.header = document.querySelector('.modal h3');
    this.content = document.querySelector('.modal .content');

    this.trigger.addEventListener('change', (e: Event) => {
      if (this.trigger.checked === false && this.closeCb) {
        this.closeCb();
        this.closeCb = null; // Immediately remove it
      }
    });
  }

  show(displayText: string): void {
    this.header.innerText = Game.currentPlayer.name;
    this.content.innerText = displayText;
    this.trigger.checked = true;
  }

  close(): void {
    this.enableClose();
    this.trigger.checked = false;
    this.trigger.dispatchEvent(new Event('change'));
  }

  disableClose(): void {
    this.controls.forEach((control: HTMLLabelElement) => {
      control.setAttribute('for', `${this.triggerId}__DISABLED`);
    });
  }

  enableClose(): void {
    this.controls.forEach((control: HTMLLabelElement) => {
      control.setAttribute('for', this.triggerId);
    });
  }

  // TODO: change to promise in case a rule needs more than one player action
  requireDiceRolls(n: number, cb: Function): void {
    const rolls: number[] = [];
    const frag: DocumentFragment = document.createDocumentFragment();

    for (let i = 0; i < n; i++) {
      frag.appendChild(document.createElement('dice-roll'));
    }
    this.content.appendChild(frag);

    Array.from(this.content.querySelectorAll('dice-roll')).forEach((el: HTMLElement) => {
      el.addEventListener('roll', (e: CustomEvent) => {
        rolls.push(e.detail.roll);
        
        if (rolls.length === n) {
          // bad
          setTimeout(() => { cb(rolls) }, 1000);
        }
      });
    });
  }

  // TODO: implement number of players user can choose
  requirePlayerSelection(playerList: Player[]): Promise<Player[]> {
    if (!playerList || playerList.length === 0) return Promise.resolve([]);

    const names = playerList.map(p => p.name);
    const frag: DocumentFragment = document.createDocumentFragment();
    const header: HTMLHeadingElement = document.createElement('h4');
    header.innerText = 'Choose a player';
    frag.appendChild(header);

    names.forEach((name: string) => {
      const playerLink: HTMLAnchorElement = document.createElement('a');
      playerLink.classList.add('sm');
      playerLink.href = '#';
      playerLink.innerText = name;
      playerLink.dataset.name = name;
      frag.appendChild(playerLink);
      frag.appendChild(document.createTextNode('\u00A0\u00A0'));
    });
    this.content.appendChild(frag);

    return new Promise((resolve) => {
      Array.from(this.content.querySelectorAll('a')).forEach((el: HTMLElement) => {
        el.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const selectedPlayer = playerList.find((p: Player) =>  {
            return p.name === (e.currentTarget as HTMLElement).dataset.name
          });
          resolve([selectedPlayer]);
          return false;
        });
      });
    });
  }

  whenClosed(cb: Function): void {
    this.closeCb = cb;
  }
}
