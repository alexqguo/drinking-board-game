class DiceRoll extends HTMLElement {
  // content: string;
  // link: HTMLAnchorElement;
  // resultContainer: HTMLSpanElement;

  static get observedAttributes() {
    return ['result'];
  }

  constructor() {
    super();

    this.innerHTML = DiceRoll.content;
    this.link = this.querySelector('a');
    this.resultContainer = this.querySelector('span');

    this.link.addEventListener('click', (e) => {
      e.preventDefault();
      this.roll();
      return false;
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'result') {
      if (newVal) {
        this.renderResult(newVal);
      } else {
        this.reset();
      }
    }
  }

  roll() {
    const roll = Math.floor(Math.random() * 6) + 1;
    this.setAttribute('result', roll.toString());
    this.dispatchEvent(new CustomEvent('roll', {
      detail: { roll }
    }));
  }

  renderResult(result) {
    this.link.style.display = 'none';
    this.resultContainer.innerText = `🎲 ${result}`;
  }

  reset() {
    this.link.style.display = 'inline';
    this.resultContainer.innerText = '';
  }
}

DiceRoll.rollText = 'Roll';
DiceRoll.content = `
  <div>
    <a href="#">${DiceRoll.rollText}</a>
    <span></span>
  </div>
`;

window.customElements.define('dice-roll', DiceRoll);