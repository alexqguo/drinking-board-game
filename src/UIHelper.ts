import Game from './Game';

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

export function showModal(displayText: string) {
  const modalTrigger: HTMLInputElement = document.querySelector('#game-modal');
  const modalHeader: HTMLHeadingElement = document.querySelector('.modal h3');
  const modalContent: HTMLElement = document.querySelector('.modal .content');
  modalHeader.innerText = Game.currentPlayer.name;
  modalContent.innerText = displayText;

  modalTrigger.checked = true;
}
// (window as any).sm = showModal; //debugging

