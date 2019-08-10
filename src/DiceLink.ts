class DiceLink extends HTMLElement {
  content: string;

  static rollText = 'Roll';
  static content = `
    <div>
      <a href="#">${DiceLink.rollText}</a>
      <span></span>
    </div>
  `;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    // this.
  }
}

window.customElements.define('dice-link', DiceLink);