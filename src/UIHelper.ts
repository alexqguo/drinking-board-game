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