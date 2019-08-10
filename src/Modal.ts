import Game from './Game';

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

  requireDiceRolls(n: number, cb: Function) {
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
          cb(rolls);
        }
      });
    });
  }

  whenClosed(cb: Function): void {
    this.closeCb = cb;
  }
}
