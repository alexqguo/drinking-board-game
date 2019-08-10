import Game from './Game';

/**
 * PLEASE READ
 * This file is on my short list of the most horrible things I've coded in this project
 * which need to change immediately. I am aware of how bad this is, and I'm not exactly sure why
 * I did this in the first place.
 */

// Really needs to be a web component
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
    this.link.innerText = `${playerName} - ${this.rollText}`;
    this.resultContainer.innerText = '';
    this.link.dataset.playerTarget = playerName;
    this.rollCallback = callback;
  }

  disable() {
    this.link.innerText = '🎲';
    this.link.dataset.playerTarget = null;
    this.rollCallback = null;
  }
}

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

  requireDiceRolls(n: number) {
    const rolls = [];

  }

  whenClosed(cb: Function): void {
    this.closeCb = cb;
  }
}
