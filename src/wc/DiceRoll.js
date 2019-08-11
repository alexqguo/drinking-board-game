// TODO: move to ts
class DiceRoll extends HTMLElement {

  static get observedAttributes() {
    return ['result', 'roll-text'];
  }

  static getInitialContent(rollText = DiceRoll.defaultRollText) {
    return `
      <div>
        <a class="button sm" href="#">${rollText}</a>
        <span></span>
      </div>
    `;
  }

  constructor() {
    super();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'result') {
      if (newVal) {
        this.renderResult(newVal);
      } else {
        this.reset();
      }
    } else if (attrName === 'roll-text') {
      // no-op. no need for a handler here right now 
    }
  }

  connectedCallback() {
    this.innerHTML = DiceRoll.getInitialContent(this.getAttribute('roll-text') || DiceRoll.defaultRollText);
    this.link = this.querySelector('a');
    this.resultContainer = this.querySelector('span');

    this.link.addEventListener('click', (e) => {
      e.preventDefault();
      this.roll();
      return false;
    });

    this.resultContainer.addEventListener('click', (e) => {
      this.reset();
    });
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

DiceRoll.defaultRollText = 'Roll';

window.customElements.define('dice-roll', DiceRoll);