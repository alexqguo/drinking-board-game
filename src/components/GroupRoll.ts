import { LitElement, html, customElement, property } from 'lit-element';

// Should probably combine this into TrainerBattle at some point
@customElement('group-roll')
export class GroupRoll extends LitElement {
  rolls: number = 0;

  @property({ type: Array })
  players: string[];

  @property({ type: String })
  displayText: string;

  createRenderRoot() {
    return this;
  }

  handleRoll(e: CustomEvent) {
    if (++this.rolls >= this.players.length) {
      this.dispatchEvent(new CustomEvent('done'));
    }
  }

  renderPlayer(name: string) {
    return html`${name}: <dice-roll @roll="${this.handleRoll}"></dice-roll>`;
  }

  render() {
    return html`
      ${this.displayText}

      <div style="font-size: 1rem">
        ${this.players.map((p: string) => this.renderPlayer(p))}
      </div>
    `;
  }
}