import { LitElement, html, customElement, property } from 'lit-element';

@customElement('dice-roll')
export class DiceRoll extends LitElement {
  link: HTMLAnchorElement;
  resultContainer: HTMLSpanElement;

  @property({ type: String })
  result = '';

  @property({ type: String })
  rollText = 'Roll';

  // Opting out of shadow dom in order to inherit CSS for the time being
  createRenderRoot() {
    return this;
  }

  handleClick(e: Event) {
    e.preventDefault();
    const roll = Math.floor(Math.random() * 6) + 1;
    this.result = roll.toString();

    this.dispatchEvent(new CustomEvent('roll', {
      detail: { roll }
    }));
  }

  reset() {
    this.result = '';
  }

  renderReset() {
    return html`
      <div>
        <a @click="${this.handleClick}" class="button sm" href="#">${this.rollText}</a>
        <span></span>
      </div>
    `;
  }

  renderResult(result: string) {
    return html`
      <div @click="${this.reset}">🎲 ${result}</div>
    `;
  }

  render() {
    if (this.result) {
      return this.renderResult(this.result);
    }

    return this.renderReset();
  }
}
