import Game from './Game';
import Player from './Player';
import { Rule } from '../rules';

// TODO: lit-element. this is a piece of shit
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
        const cb = this.closeCb;
        this.closeCb = null;
        // Have to do it this way because the callback can trigger events which reset the closeCb
        // Short term fix, this entire thing will be refactored soon anyway (I hope)
        cb();
      }
    });
  }

  show(displayText: string): void {
    this.header.innerText = Game.currentPlayer.name;
    this.content.innerText = displayText;
    this.trigger.checked = true;
  }

  clearContent(): void {
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }
  }

  // This is what should be used going forward
  openWithFragment(headerText: string, frag: DocumentFragment): void {
    this.header.innerText = headerText;
    this.clearContent();
    this.content.appendChild(frag);
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
  requirePlayerSelection(playerList: Player[], headerString: string = 'Choose a player'): Promise<Player[]> {
    if (!playerList || playerList.length === 0) return Promise.resolve([]);

    const links = this.addLinks(headerString, playerList.map(p => p.name));

    return new Promise((resolve) => {
      Array.from(links).forEach((el: HTMLElement) => {
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

  requireChoice(rules: Rule[]): Promise<Rule> {
    if (!rules || rules.length === 0) return Promise.resolve(null);

    const links = this.addLinks('Choose an outcome', rules.map(r => r.displayText));

    return new Promise((resolve) => {
      Array.from(links).forEach((el: HTMLElement) => {
        el.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const selectedRule = rules.find((r: Rule) => {
            return r.displayText === (e.currentTarget as HTMLElement).dataset.name
          });
          resolve(selectedRule);
          return false;
        });
      });
    });
  }

  addLinks(headerText: string, descriptions: string[]) {
    const links: HTMLAnchorElement[] = [];
    const frag: DocumentFragment = document.createDocumentFragment();
    const header: HTMLHeadingElement = document.createElement('h4');
    header.innerText = headerText;
    frag.appendChild(header);

    descriptions.forEach((desc: string) => {
      const playerLink: HTMLAnchorElement = document.createElement('a');
      playerLink.classList.add('sm');
      playerLink.href = '#';
      playerLink.innerText = desc;
      playerLink.dataset.name = desc;
      frag.appendChild(playerLink);
      frag.appendChild(document.createTextNode('\u00A0\u00A0'));
      links.push(playerLink);
    });
    this.content.appendChild(frag);
    
    return links;
  }

  whenClosed(cb: Function): void {
    this.closeCb = cb;
  }
}
